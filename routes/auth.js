const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); 
const { createUser, getUserByEmail, matchPassword, generateAuthToken } = require("../models/User");
const authMiddleware = require("../middleware/auth"); 
const db = require("../config/db");
const router = express.Router();



router.post("/signup", (req, res) => {
  getUserByEmail(req.body.email, async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    createUser(req.body, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "User registered successfully" });
    });
  });
});


router.post("/login", (req, res) => {
  getUserByEmail(req.body.email, async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = results[0];

    const isMatch = await matchPassword(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateAuthToken(user.id);
    res.json({ message: "Login successful", token });
  });
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    console.log("User ID from JWT:", req.user.id);  

    const query = "SELECT id, username, email FROM users WHERE id = ?";
    db.query(query, [req.user.id], (err, results) => {
      if (err) {
        console.error("Database error:", err); 
        return res.status(500).json({ message: "Server error" });
      }

      console.log("Database query results:", results);  

      if (results.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      res.json({ user: results[0] });
    });
  } catch (error) {
    console.error("Error in /me route:", error);  
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
