const express = require('express');
const taskrouter = express.Router();
const { userMiddleware } = require('../usermiddle');
const { Task } = require('../db');

taskrouter.post("/create", userMiddleware, async(req, res) => {
    const userId = req.userId;
    const { title, description } = req.body;
    try{
        await Task.create({ title, description, userId: userId });
        res.json({ message: "Task created" });
    }catch(err){
        console.log("Error in creating task:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
})

taskrouter.put("/update",userMiddleware, async(req, res) => {
    const userId = req.userId;
    const { taskId, title, description, completed } = req.body;

    try{
        const task = await Task.findOne({ _id: taskId, userId: userId });
        if(!task){
            return res.status(404).json({ error: "Task not found" });
        }
        console.log("first")
        task.title = title || task.title;
        task.description = description || task.description;
        task.completed = completed !== undefined ? completed : task.completed;
        await task.save();

        res.json({ message: "Task updated" });
    }catch(err){
        console.log("Error in updating task:", err);
        return res.status(500).json({ error: "Internal server error" });
    }   
})

taskrouter.delete("/delete", userMiddleware, async(req, res) => {
    const userId = req.userId;
    const { taskId } = req.body;
    try{
        const task = await Task.findOneAndDelete({ _id: taskId, userId: userId });
        if(!task){
            return res.status(404).json({ error: "Task not found" });
        }
        res.json({ message: "Task deleted" });
    }catch(err){
        console.log("Error in updating task:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
})

taskrouter.get("/todos",userMiddleware, async(req, res) => {
    const userId = req.userId
    const todos = await Task.find({userId: userId})
    if(!todos){
        return res.status(404).json({ error: "No courses found" });
    }

    res.json({ todos });
})

module.exports = taskrouter;