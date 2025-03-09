require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser"); // Import cookie-parser
const pool = require("./config/db.js");
const authMiddleware = require("./middlewares/authMiddleware.js"); // Import authMiddleware

// Import Routes
const publicRoutes = require("./routes/publicRoutes.js");
const detectionRoutes = require("./routes/detectionRoutes.js");
const analyticRoutes = require("./routes/analyticRoutes.js");
const cameraRoutes = require("./routes/cameraRoutes.js"); // ✅ Add Camera Routes
const dashboardRoutes = require("./routes/dashboardRoutes.js");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL, // ✅ Explicitly allow frontend URL
    credentials: true, // ✅ Allow cookies to be sent with requests
    methods: ["GET", "POST", "DELETE", "PUT"], // ✅ Allow necessary HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allow required headers
  })
);

app.use(express.json());
app.use(cookieParser()); // Enable cookie parsing
app.use(morgan("dev"));

// Configure DB connection with AWS PostgreSQL
pool
  .connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ PostgreSQL connection error:", err));

// Public Route (No Authentication Required)
app.get("/", (req, res) => {
  console.log("🔹 Received request to '/' route");
  res.send("Server is running");
});

app.get("/hi", (req, res) => {
  console.log("🔹 Received request to '/hi' route");
  res.send("Endpoint is running");
});

// Public Routes (No Authentication Required)
app.use("/api/uploadDetection", publicRoutes); // Exempt from Auth

// Protected Routes (Require Authentication)
app.use("/api/detections", authMiddleware, detectionRoutes);
app.use("/api/analytics", authMiddleware, analyticRoutes);
app.use("/api/cameras", authMiddleware, cameraRoutes); // ✅ Add Cameras Route (Protected)
app.use("/api/dashboard", authMiddleware, dashboardRoutes); // ✅ Add Cameras Route (Protected)

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
