const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "luna";

// Middleware to protect routes and extract user from JWT token
const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    db.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }
      if (results.length === 0) {
        return res.status(401).json({ message: "User not found" });
      }
      req.user = results[0];
      next();
    });
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

// Register route
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  // Check if user exists
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    if (results.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Database error" });
        }
        res.status(201).json({ message: "User registered successfully" });
      }
    );
  });
});

// Login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];

    // Compare password (handle hashed and legacy plain text)
    let passwordMatch = false;
    if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
      passwordMatch = await bcrypt.compare(password, user.password);
    } else {
      // Legacy plain text password (not recommended)
      passwordMatch = password === user.password;
    }

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

    // Return token and user info (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  });
});

// Get current user route (protected)
router.get("/me", authMiddleware, (req, res) => {
  if (!req.user) {
    return res.status(404).json({ message: "User not found" });
  }
  const { password, ...userWithoutPassword } = req.user;
  res.json(userWithoutPassword);
});

module.exports = router;
