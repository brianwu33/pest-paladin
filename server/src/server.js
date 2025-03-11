require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const pool = require("./config/db.js");
const authMiddleware = require("./middlewares/authMiddleware.js");
const http = require("http");
const { createWebSocketServer } = require("./websocket"); // ✅ Correct Import

// Import Routes
const publicRoutes = require("./routes/publicRoutes.js");
const detectionRoutes = require("./routes/detectionRoutes.js");
const analyticRoutes = require("./routes/analyticRoutes.js");
const cameraRoutes = require("./routes/cameraRoutes.js");
const dashboardRoutes = require("./routes/dashboardRoutes.js");

const app = express();
const server = http.createServer(app);

// Notification WebSocket Setup
createWebSocketServer(server); // ✅ Initialize WebSocket

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Configure DB connection with AWS PostgreSQL
pool
  .connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ PostgreSQL connection error:", err));

// Public Routes
app.use("/api/uploadDetection", publicRoutes); // Exempt from Auth

// Protected Routes (Require Authentication)
app.use("/api/detections", authMiddleware, detectionRoutes);
app.use("/api/analytics", authMiddleware, analyticRoutes);
app.use("/api/cameras", authMiddleware, cameraRoutes);
app.use("/api/dashboard", authMiddleware, dashboardRoutes);

// Start Server
const PORT = process.env.PORT || 3001;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
