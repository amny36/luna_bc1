const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("./config/db");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const reportRoutes = require("./routes/report");
const progressReportRoutes = require("./routes/progress_report");
const postureRoutes = require("./routes/posture");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Allow requests from your React app
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'], // Include all required headers
  credentials: true, // Allow cookies if needed
  exposedHeaders: ['Authorization']
};

app.use(cors(corsOptions)); // Apply CORS middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data

// Database Connection
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL database.");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/progress_report", progressReportRoutes);
app.use("/api/posture", postureRoutes); // This connects your posture route

// Route de test globale
app.get('/api/test', (req, res) => {
  res.json({ 
    status: "success",
    message: "API is working",
    database: "connected", // Vérification MySQL
    timestamp: new Date() 
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'An unexpected error occurred' });
});
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
