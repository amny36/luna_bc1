const db = require("../config/db");


const createTask = (taskData, callback) => {
  const { user_id, title, description, due_date, completed } = taskData;
  const query = "INSERT INTO tasks (user_id, title, description, due_date, completed) VALUES (?, ?, ?, ?, ?)";
  
  db.query(query, [user_id, title, description, due_date, completed || false], (err, result) => {
    if (err) {
      console.error("Error creating task:", err.message);
      return callback(err, null); 
    }
    console.log("Task created successfully with ID:", result.insertId);
    callback(null, result); 
  });
};

const getAllTasks = (userId, callback) => {
  const query = "SELECT * FROM tasks WHERE user_id = ?";
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching tasks:", err.message);
      return callback(err, null);
    }
    callback(null, results); 
  });
};


const getTaskById = (taskId, userId, callback) => {
  const query = "SELECT * FROM tasks WHERE id = ? AND user_id = ?";
  
  db.query(query, [taskId, userId], (err, results) => {
    if (err) {
      console.error("Error fetching task by ID:", err.message);
      return callback(err, null);
    }
    if (results.length === 0) {
      console.warn("Task not found with ID:", taskId);
      return callback(new Error("Task not found or doesn't belong to user"), null); 
    }
    callback(null, results[0]); 
  });
};

const updateTask = (taskId, userId, completed, callback) => {
  const completedValue = typeof completed === "boolean" ? (completed ? 1 : 0) : completed;

  const query = `
    UPDATE tasks 
    SET \`completed\` = ? 
    WHERE \`id\` = ? AND \`user_id\` = ?
  `;

  db.query(query, [completedValue, taskId, userId], (err, result) => {
    if (err) {
      console.error("Error updating task completion with ID:", taskId, err.message);
      return callback(err, null);
    }
    if (result.affectedRows === 0) {
      console.warn("No task updated", taskId);
      return callback(new Error("No task updated"), null);
    }
    callback(null, result);
  });
};



const deleteTask = (taskId, userId, callback) => {
  console.log("Deleting task with ID:", taskId , "for user:", userId);
  const query = "DELETE FROM tasks WHERE id = ? AND user_id = ?";
  
  db.query(query, [taskId, userId], (err, result) => {
    if (err) {
      console.error("Error deleting task with ID:", taskId, err.message);
      return callback(err, null);
    }
    if (result.affectedRows === 0) {
      console.warn("No task deleted, possibly task does not exist or doesn't belong to user:", taskId);
      return callback(new Error("No task deleted"), null); 
    }
    console.log("Task with ID:", taskId, "deleted successfully");
    callback(null, result); 
  });
};

module.exports = { createTask, getAllTasks, getTaskById, updateTask, deleteTask };
