import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { addTasksToRedis, modifyTasksInRedis } from "../utils/schedular.js";

export const getUserById = async (req, res) => {
    const {id} = req.params;
    try{
        const user = await User.findById(id);
        if (!user) return res.status(404).json({message: "User not found"});

        res.status(200).json(user);
    }catch(err) {
        res.status(500).json({message: err.message});
    }
}

export const updateUser = async (req, res) => {
    const {id} = req.params;
    
    if (req.user.id !== id) return res.status(403).json({message: "Unauthorized"});

    const {email, password, name} = req.body;
    try{
        const user = await User.findById(id);
        if (!user) return res.status(404).json({message: "User not found"});

        const hashedPassword = await bcrypt.hash(password, 12);
        if(email) user.email = email;
        if(password) user.password = hashedPassword;
        if(name) user.name = name;

        await user.save();

        res.status(200).json(user);
    }catch(err) {
        res.status(500).json({message: err.message});
    }
}

export const deleteUser = async (req, res) => {
    try{
        const {id} = req.params;

        if (req.user.id !== id) return res.status(403).json({message: "Unauthorized"});

        console.log(id);
        await User.findByIdAndDelete(id);
        res.clearCookie("pinger_access_token");

        res.status(200).json({message: "User deleted"});
    }catch(err) {
        res.status(500).json({message: err.message});
    }
}

export const getUserProjects = async (req, res) => {
    const {id} = req.params;
    try{
        const user = await User.findById(id);
        if (!user) return res.status(404).json({message: "User not found"});

        res.status(200).json(user.projects);
    } catch(err) {
        res.status(500).json({message: err.message});
    }
}

export const getUserProjectById = async (req, res) => {
    const {user_id} = req.params;
    const {project_id} = req.params;
    try{
        const user = await User.findById(user_id);
        if (!user) return res.status(404).json({message: "User not found"});

        const project = user.projects.find(project => project._id == project_id);
        if (!project) return res.status(404).json({message: "Project not found"});

        res.status(200).json(project);
    } catch(err) {
        res.status(500).json({message: err.message});
    }
}

export const addUserProject = async (req, res) => {
    try{
        const {id} = req.params;
        const {name, items} = req.body;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({message: "User not found"});

        user.projects.push({name, items});
        await user.save();
        // add to redis
        await addTasksToRedis(user.projects[user.projects.length - 1].items, user.projects[user.projects.length - 1]._id, user._id);

        res.status(200).json(user.projects[user.projects.length - 1]);
    } catch(err) {
        res.status(500).json({message: err.message});
    }
}

export const updateUserProject = async (req, res) => {
    try {
      const { user_id, project_id } = req.params;
      const { name, items } = req.body;
  
      if (req.user.id !== user_id)
        return res.status(403).json({ message: "Unauthorized" });
  
      // Fetch the user to validate the project and get current items
      const user = await User.findById(user_id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const project = user.projects.find(
        (proj) => proj._id.toString() === project_id
      );
      if (!project) return res.status(404).json({ message: "Project not found" });
  
      // If items are provided, ensure that the count matches to preserve existing _ids
      if (items && Array.isArray(items)) {
        if (items.length !== project.items.length) {
          return res.status(400).json({
            message: "The number of items provided must match the existing items."
          });
        }
      }
  
      // Build the update object using the positional operator "$"
      const updateData = {};
      if (name) {
        updateData["projects.$.name"] = name;
      }
      if (items && Array.isArray(items)) {
        // For each incoming item, use the _id from the corresponding existing item.
        const updatedItems = items.map((newItem, index) => {
          return { _id: project.items[index]._id, ...newItem };
        });
        updateData["projects.$.items"] = updatedItems;
      }
  
      // Use findOneAndUpdate to update the matching project inside the user document
      const updatedUser = await User.findOneAndUpdate(
        { _id: user_id, "projects._id": project_id },
        { $set: updateData },
        { new: true }
      );
  
      // Get the updated project from the updated user document.
      const updatedProject = updatedUser.projects.find(
        (proj) => proj._id.toString() === project_id
      );
  
      // Update tasks in Redis using the modified project items.
      await modifyTasksInRedis(user_id, project_id, "update", updatedProject.items);
  
      return res.status(200).json(updatedProject);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };  

export const deleteUserProject = async (req, res) => {
    const {user_id} = req.params;
    const {project_id} = req.params;

    if (req.user.id !== user_id) return res.status(403).json({message: "Unauthorized"});

    try{
        const user = await User.findById(user_id);
        if (!user) return res.status(404).json({message: "User not found"});

        const project = user.projects.find(project => project._id == project_id);
        if (!project) return res.status(404).json({message: "Project not found"});

        user.projects = user.projects.filter(project => project._id != project_id);
        await user.save();

        // delete from redis
        await modifyTasksInRedis(user_id, project_id, "delete");

        res.status(200).json({message: "Project deleted"});
    } catch(err) {
        res.status(500).json({message: err.message});
    } 
}