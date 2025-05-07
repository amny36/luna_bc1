const db = require("../config/db");  
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const createUser = async (userData, callback) => {
  const { username, email, password } = userData;


  const hashedPassword = await bcrypt.hash(password, 10);

  const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
db.query(query, [username, email, hashedPassword], callback);
}


const getUserByEmail = (email, callback) => {
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], callback);
};


const matchPassword = async (enteredPassword, storedPassword) => {
  return await bcrypt.compare(enteredPassword, storedPassword);
};


const generateAuthToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};


const updateUserCycles = (userId, callback) => {
  const query = "UPDATE users SET cycles = cycles + 1 WHERE id = ?";
  db.query(query, [userId], callback);
};


const getUserCycles = (userId, callback) => {
  const query = "SELECT cycles FROM users WHERE id = ?";
  db.query(query, [userId], callback);
};

module.exports = { createUser, getUserByEmail, matchPassword, generateAuthToken, updateUserCycles, getUserCycles };
