require("dotenv").config({path:"../.env"});
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const pool = require("./config/db.js");

// Routes
const detectionRoutes = require("./routes/detectionRoutes.js");
const trackingRoutes = require("./routes/trackingRoutes.js");
const analyticRoutes = require("./routes/analyticRoutes.js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Configure DB connection with AWS PostgreSQL
pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("X PostgreSQL connection error:", err));

// Basic route
app.get("/", (req, res) => {
  console.log("🔹 Received request to '/' route");
  res.send("Server is running");
});

// Routes
console.log("🔹 Setting up routes...");
app.use("/api/detections", detectionRoutes);
app.use("/api/trackings", trackingRoutes);
app.use("/api/analytics", analyticRoutes);

// Start Server
const PORT = 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`New server listening on port ${PORT}`);
});
