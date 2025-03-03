const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("./config/db");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const reportRoutes = require("./routes/report"); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());


db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL database.");
});


app.use("/api/auth", authRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
