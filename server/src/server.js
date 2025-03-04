require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser"); // Import cookie-parser
const pool = require("./config/db.js");
const authMiddleware = require("./middlewares/authMiddleware.js"); // Import authMiddleware

// Routes
const detectionRoutes = require("./routes/detectionRoutes.js");
const trackingRoutes = require("./routes/trackingRoutes.js");
const analyticRoutes = require("./routes/analyticRoutes.js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser()); // Enable cookie parsing
app.use(morgan("dev"));

// Configure DB connection with AWS PostgreSQL
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ PostgreSQL connection error:", err));

// Public Route (No Authentication Required)
app.get("/", (req, res) => {
  console.log("🔹 Received request to '/' route");
  res.send("Server is running");
});

// Protected Routes (Require Authentication)
app.use("/api/detections", authMiddleware, detectionRoutes);
app.use("/api/trackings", authMiddleware, trackingRoutes);
app.use("/api/analytics", authMiddleware, analyticRoutes);

// Start Server
const PORT = 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
