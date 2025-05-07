const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Your MySQL connection

// POST /api/posture/device - ESP32 sends posture data
router.post('/device', (req, res) => {
  const { distance, device_id } = req.body;

  // Validate input
  if (typeof distance === 'undefined' || !device_id) {
    return res.status(400).json({ error: 'Both distance and device_id are required' });
  }

  // Determine posture status based on distance
  const posture_status = (distance >= 45 && distance <= 60) ? 'Good' : 'Bad';

  // You can assign user_id based on device_id or hardcode for now
  const user_id = 1; // TODO: Replace with real user lookup if needed

  // Placeholder for angle_data, empty object for now
  const angle_data = {};

  // Insert query
  const query = `
    INSERT INTO posture_tracking (user_id, posture_status, angle_data, distance, device_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [
    user_id,
    posture_status,
    JSON.stringify(angle_data),
    distance,
    device_id
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting posture data:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(201).json({
      message: 'Posture data saved successfully',
      data: { id: result.insertId, posture_status }
    });
  });
});

module.exports = router;
