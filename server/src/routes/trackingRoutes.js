const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { spawn } = require("child_process");

const router = express.Router();

// Multer configuration (Store files in 'uploads/' folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// POST /api/tracking/upload → Upload image & run tracking
router.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const imagePath = req.file.path;

  // Run Python script for tracking
  const pythonProcess = spawn("python3", ["scripts/tracking.py", imagePath]);

  let output = "";
  pythonProcess.stdout.on("data", (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error("Python Error:", data.toString());
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: "Tracking process failed" });
    }

    // Send JSON response from Python
    res.json({ message: "Tracking completed", trackingData: JSON.parse(output) });

    // Optionally, delete the uploaded file after processing
    fs.unlink(imagePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });
  });
});

// GET /api/tracking/test → Test endpoint
router.get("/test", (req, res) => {
  res.json({ message: "Tracking API is working" });
});

module.exports = router;
