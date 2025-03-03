const jwt = require("jsonwebtoken");
const db = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "luna";

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

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
      console.log("User from DB:", req.user);
      next();
    });
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
