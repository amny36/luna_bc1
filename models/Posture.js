const db = require("../config/db");

const createPostureData = (postureData, callback) => {
  const { user_id, timestamp, distance } = postureData;
  const query = "INSERT INTO posture_tracking (user_id, timestamp, distance) VALUES (?, ?, ?)";

  db.query(query, [user_id, timestamp, distance], (err, result) => {
    if (err) {
      console.error("Error creating posture data:", err.message);
      return callback(err, null);
    }
    console.log("Posture data created successfully with ID:", result.insertId);
    callback(null, result);
  });
};

const getAllPostureData = (userId, callback) => {
  const query = "SELECT * FROM posture_tracking WHERE user_id = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching posture data:", err.message);
      return callback(err, null);
    }
    callback(null, results);
  });
};

const getPostureDataById = (dataId, userId, callback) => {
  const query = "SELECT * FROM posture_tracking WHERE data_id = ? AND user_id = ?";

  db.query(query, [dataId, userId], (err, results) => {
    if (err) {
      console.error("Error fetching posture data by ID:", err.message);
      return callback(err, null);
    }
    if (results.length === 0) {
      console.warn("Posture data not found with ID:", dataId);
      return callback(new Error("Posture data not found or doesn't belong to user"), null);
    }
    callback(null, results[0]);
  });
};

const updatePostureData = (dataId, userId, distance, callback) => {
  const query = `
    UPDATE posture_tracking
    SET distance = ?
    WHERE data_id = ? AND user_id = ?
  `;

  db.query(query, [distance, dataId, userId], (err, result) => {
    if (err) {
      console.error("Error updating posture data with ID:", dataId, err.message);
      return callback(err, null);
    }
    if (result.affectedRows === 0) {
      console.warn("No posture data updated", dataId);
      return callback(new Error("No posture data updated"), null);
    }
    callback(null, result);
  });
};

const deletePostureData = (dataId, userId, callback) => {
  console.log("Deleting posture data with ID:", dataId, "for user:", userId);
  const query = "DELETE FROM posture_tracking WHERE data_id = ? AND user_id = ?";

  db.query(query, [dataId, userId], (err, result) => {
    if (err) {
      console.error("Error deleting posture data with ID:", dataId, err.message);
      return callback(err, null);
    }
    if (result.affectedRows === 0) {
      console.warn("No posture data deleted, possibly it does not exist or doesn't belong to user:", dataId);
      return callback(new Error("No posture data deleted"), null);
    }
    console.log("Posture data with ID:", dataId, "deleted successfully");
    callback(null, result);
  });
};

module.exports = {
  createPostureData,
  getAllPostureData,
  getPostureDataById,
  updatePostureData,
  deletePostureData
};
