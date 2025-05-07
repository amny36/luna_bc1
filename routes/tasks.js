const express = require("express");
const router = express.Router();
const { createTask, getAllTasks, getTaskById, updateTask, deleteTask } = require("../models/Task");
const authMiddleware = require('../middleware/auth'); 
const db = require("../config/db");

router.post("/", authMiddleware, (req, res) => {
  const userId = req.user.id; 

  if (!userId) {
    return res.status(400).json({ message: "User ID not found" });
  }

 
  const taskData = {
    user_id: userId,
    title: req.body.title,
    description: req.body.description,
    due_date: req.body.dueDate,
    completed: req.body.completed || false
  };


  createTask(taskData, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Task created successfully", task: result });
  });
});

router.get("/", authMiddleware, (req, res) => {
  const userId = req.user.id; 

  if (!userId) {
    return res.status(400).json({ message: "User ID not found" });
  }


  getAllTasks(userId, (err, results) => {  
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


router.get("/:id", authMiddleware, (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ message: "User ID not found" });
  }


  getTaskById(req.params.id, userId, (err, results) => { 
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Task not found" });
    res.json(results[0]);
  });
});


router.put("/:id", authMiddleware, (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ message: "User ID not found" });
  }


  getTaskById(req.params.id, userId, (err, results) => {  
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Task not found" });


    const userIdR = results.user_id;
    
    if (userIdR !== userId) {
      return res.status(403).json({ message: "You are not authorized to update this task" });
    }
  
    updateTask(req.params.id,userIdR ,req.body.completed, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Task updated successfully" });
    });
  });
});


router.delete("/:id", authMiddleware, (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ message: "User ID not found" });
  }

  getTaskById(req.params.id, userId, (err, results) => {  
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Task not found" });
    console.log(results);
    const userIdR = results.user_id;
    
    
    if (userIdR !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this task" });
    }
    
   
    deleteTask(req.params.id,userIdR, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Task deleted successfully" });
    });
  });
});

module.exports = router;
