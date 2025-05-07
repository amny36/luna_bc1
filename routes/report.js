const express = require("express");
const router = express.Router();
const { updateUserCycles, getUserCycles } = require("../models/User");
const authMiddleware = require("../middleware/auth"); 
const db = require("../config/db");

router.post("/cycles", authMiddleware, (req, res) => {
  const userId = req.user.id; 

  updateUserCycles(userId, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to update cycle data" });
    }
    res.status(200).json({ message: "Cycle completed" });
  });
});

router.get("/cycles", authMiddleware, (req, res) => {
  const userId = req.user.id;

  getUserCycles(userId, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch cycle data" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ cycles: results[0].cycles });
  });
});

module.exports = router;
