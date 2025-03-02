import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import cron from "node-cron";
import { createClient } from "redis";
import { checkRedisConnection } from "./utils/redisConnection.js";
import { getTodaysTasks, sendPings } from "./utils/schedular.js";

dotenv.config();

const app = express();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

export const client = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();

await client.set("foo", "bar");
const result = await client.get("foo");
console.log(result); // >>> bar





cron.schedule("0 * * * *", async () => {
    console.log("⏳ Running daily ping job...");

    const isConnected = await checkRedisConnection();
    if (!isConnected) {
        console.log("🔴 Skipping job: Redis is not connected.");
        return;
    }

    try {
        const tasks = await getTodaysTasks(); // Fetch today's tasks
        if (tasks.length > 0) {
            await sendPings(tasks);
        } else {
            console.log("⚡ No tasks scheduled for today.");
        }
    } catch (err) {
        console.error("❌ Error in daily ping job:", err);
    }
});


app.use(express.json());
app.use(cookieParser());

app.use("/test1", (req, res) => {
    console.log("Test route 1")
    res.send("Test route 1")
});
app.use("/test2", (req, res) => {
    console.log("Test route 2")
    res.send("Test route 2")
});
app.use("/test3", (req, res) => {
    console.log("Test route 3")
    res.send("Test route 3")
});
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
