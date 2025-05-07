const express = require("express");
const router = express.Router();
const { createProgressReport } = require("../models/ProgressReport");
const authMiddleware = require("../middleware/auth");
const db = require("../config/db");

// Create a progress report
router.post("/", authMiddleware, (req, res) => {
  const { user_id, week_start_date, focus_time_minutes, progress_score } = req.body;

  if (user_id !== req.user.id) {
    return res.status(403).json({ error: "Unauthorized user ID" });
  }

  if (!user_id || !week_start_date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `
    INSERT INTO user_progress_reports 
    (user_id, week_start_date, focus_time_minutes, progress_score) 
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [user_id, week_start_date, focus_time_minutes, progress_score], (err, result) => {
    if (err) {
      console.error("Error creating progress report:", err);
      return res.status(500).json({ 
        error: "Failed to create progress report", 
        details: err.message 
      });
    }

    res.status(201).json({ 
      message: "Progress report created successfully", 
      reportId: result.insertId 
    });
  });
});

module.exports = router;
