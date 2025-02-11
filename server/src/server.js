require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

const detectionRoutes = require("./routes/detections");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

// Basic route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Routes
app.use("/api/detections", detectionRoutes);

// Start Server
const PORT = process.env.PORT || 3001;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on ${PORT}`);
});