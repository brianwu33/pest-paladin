const express = require("express");
const upload = require("../middlewares/upload"); // Middleware for S3 uploads
const {
  saveDetection,
  getAllDetections,
  getDetectionById,
} = require("../controllers/detectionController");

const router = express.Router();

// Post detections
router.post("/uploadDetection", upload.single("image"), saveDetection);

// Fetch all object detection data
router.get("/", getAllDetections);

// Get detection by ID
router.get("/:id", getDetectionById);


module.exports = router;