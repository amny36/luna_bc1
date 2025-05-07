const db = require("../config/db");

const createProgressReport = (reportData, callback) => {
  const { user_id, week_start_date, focus_time_minutes, progress_score } = reportData;
  const query = "INSERT INTO user_progress_reports (user_id, week_start_date, focus_time_minutes, progress_score) VALUES (?, ?, ?, ?)";
  
  db.query(query, [user_id, week_start_date, focus_time_minutes, progress_score], (err, result) => {
    if (err) {
      console.error("Error creating progress report:", err.message);
      return callback(err, null); 
    }
    console.log("Progress report created successfully with ID:", result.insertId);
    callback(null, result); 
  });
};

const getAllProgressReports = (userId, callback) => {
  const query = "SELECT * FROM user_progress_reports WHERE user_id = ?";
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching progress reports:", err.message);
      return callback(err, null);
    }
    callback(null, results); 
  });
};

const getProgressReportById = (reportId, userId, callback) => {
  const query = "SELECT * FROM user_progress_reports WHERE report_id = ? AND user_id = ?";
  
  db.query(query, [reportId, userId], (err, results) => {
    if (err) {
      console.error("Error fetching progress report by ID:", err.message);
      return callback(err, null);
    }
    if (results.length === 0) {
      console.warn("Progress report not found with ID:", reportId);
      return callback(new Error("Progress report not found or doesn't belong to user"), null); 
    }
    callback(null, results[0]); 
  });
};

const updateProgressReport = (reportId, userId, focus_time_minutes, progress_score, callback) => {
  const query = `
    UPDATE user_progress_reports 
    SET focus_time_minutes = ?, progress_score = ? 
    WHERE report_id = ? AND user_id = ?
  `;

  db.query(query, [focus_time_minutes, progress_score, reportId, userId], (err, result) => {
    if (err) {
      console.error("Error updating progress report with ID:", reportId, err.message);
      return callback(err, null);
    }
    if (result.affectedRows === 0) {
      console.warn("No progress report updated", reportId);
      return callback(new Error("No progress report updated"), null);
    }
    callback(null, result);
  });
};

const deleteProgressReport = (reportId, userId, callback) => {
  console.log("Deleting progress report with ID:", reportId , "for user:", userId);
  const query = "DELETE FROM user_progress_reports WHERE report_id = ? AND user_id = ?";
  
  db.query(query, [reportId, userId], (err, result) => {
    if (err) {
      console.error("Error deleting progress report with ID:", reportId, err.message);
      return callback(err, null);
    }
    if (result.affectedRows === 0) {
      console.warn("No progress report deleted, possibly it does not exist or doesn't belong to user:", reportId);
      return callback(new Error("No progress report deleted"), null); 
    }
    console.log("Progress report with ID:", reportId, "deleted successfully");
    callback(null, result); 
  });
};

module.exports = {
  createProgressReport,
  getAllProgressReports,
  getProgressReportById,
  updateProgressReport,
  deleteProgressReport
};
