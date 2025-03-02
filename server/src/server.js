require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./config/db.js")

// routes
const detectionRoutes = require("./routes/detectionRoutes.js");
const trackingRoutes = require("./routes/trackingRoutes.js");
const analyticRoutes = require("./routes/analyticRoutes.js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// configure db connections with AWS postgres
db.connect().then(() => console.log("Connected to PostgresSQL")).catch(
  (err)=> console.error("PostgreSQL connection error:", err)
);

// Basic route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Routes
app.use("/api/detections", detectionRoutes);
app.use("/api/trackings", trackingRoutes);
app.use("/api/analytics", analyticRoutes);

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on ${PORT}`);
});