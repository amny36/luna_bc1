const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "luna",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    process.exit(1);
  }
  console.log("MySQL connected");
});

db.on("error", (err) => {
  console.error("MySQL error:", err);
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    db.connect((err) => {
      if (err) {
        console.error("Error reconnecting to MySQL:", err);
        process.exit(1);
      }
      console.log("MySQL reconnected");
    });
  }
});

module.exports = db;

