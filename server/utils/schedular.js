import axios from "axios";
import { client } from "../index.js";

export const addTasksToRedis = async (tasks, project_id, user_id) => {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    throw new Error("Tasks must be a non-empty array");
  }

  const pipeline = tasks.map((task) => {
    const score = calculateScore(task.frequency);
    return client.zAdd("pinger", [
      {
        score,
        value: JSON.stringify({
          task_id: task._id,
          url: task.url,
          frequency: task.frequency,
          user_id,
          project_id,
        }),
      },
    ]);
  });

  await Promise.all(pipeline);
};

export const modifyTasksInRedis = async (user_id, project_id, action, newTasks = []) => {
    try {
        // Fetch all tasks
        const tasks = await client.zRange("pinger", 0, -1, { withScores: true });

        if (!tasks.length) return; // No tasks in Redis

        const parsedTasks = [];
        for (let i = 0; i < tasks.length; i += 2) {
            const task = JSON.parse(tasks[i]); // tasks[i] contains the task JSON string
            const score = parseFloat(tasks[i + 1]); // tasks[i + 1] is the score
            if (task.user_id === user_id) {
                parsedTasks.push({ ...task, score });
            }
        }

        if (action === "delete") {
            // Delete all tasks for the user_id
            await Promise.all(parsedTasks.map(task => client.zRem("pinger", JSON.stringify(task))));
        } 
        else if (action === "update") {
            // Remove old tasks for the user_id
            await Promise.all(parsedTasks.map(task => client.zRem("pinger", JSON.stringify(task))));

            // Add updated tasks
            const pipeline = newTasks.map(task => {
                const score = calculateScore(task.frequency);
                return client.zAdd("pinger", [
                    {
                        score,
                        value: JSON.stringify({
                            task_id: task._id,
                            url: task.url,
                            frequency: task.frequency,
                            user_id,
                            project_id
                        })
                    }
                ]);
            });

            await Promise.all(pipeline);
        }
    } catch (err) {
        console.error("Redis Task Modification Error:", err);
    }
};

export const getTodaysTasks = async () => {
    try {
        const now = new Date();
        
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).getTime();

        const tasks = await client.zRangeByScore("pinger", startOfDay, endOfDay);

        return tasks.map(task => JSON.parse(task));

    } catch (err) {
        console.error("Error fetching today's tasks:", err);
        return [];
    }
};

export const updateTaskScore = async (task, frequency) => {
    try {
        const score = calculateScore(frequency);
        await client.zAdd("pinger", [{ score, value: JSON.stringify(task) }]);
    } catch (err) {
        console.error("Error updating task score:", err);
    }
}

export const sendPings = async (tasks) => {
    try {
        await Promise.all(
            tasks.map(async (task) => {
                try {
                    const res = await axios.get(task.url);
                    console.log(`✅ Pinged ${task.url}`);
                    await updateTaskScore(task, task.frequency);
                } catch (err) {
                    console.error(`❌ Failed to ping ${task.url}:`, err.message);
                }
            })
        );
    } catch (err) {
        console.error("Error sending pings:", err);
    }
};



function calculateScore(frequency) {
  return Date.now() + frequency * 60 * 60 * 1000; // Convert hours to milliseconds
}

/* 
pinger:
{
    task_id : {
        url : "",
        frequency : 0,
        user_id : "",
        project_id : "",
        score : 0 (unix timestamp for next ping)
    },
    task_id : {
        url : "",
        frequency : 0,
        user_id : "",
        project_id : "",
        score : 0 (unix timestamp for next ping)
    },
}
*/

/*
{
    "name": "timecapsule",
    "items": [
        {
            "name": "supabase",
            "url": "render.activate.supabase",
            "frequency": 4,
            "_id": "67c3e90100fb54689064ae05"
        },
        {
            "name": "supabase2",
            "url": "render.activate.supabase",
            "frequency": 4,
            "_id": "67c3e90100fb54689064ae06"
        },
        {
            "name": "supabase3",
            "url": "render.activate.supabase",
            "frequency": 4,
            "_id": "67c3e90100fb54689064ae07"
        }
    ],
    "_id": "67c3e90100fb54689064ae04"
}
*/
