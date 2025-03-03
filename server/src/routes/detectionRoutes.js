const express = require("express");
const { upload, getImageFromS3 } = require("../middlewares/upload");
const { saveDetection, getAllDetections, getDetectionById } = require("../controllers/detectionsController");

const router = express.Router();

// Debugging Middleware - Check `req.body` and `req.file`
router.post("/uploadDetection",
  (req, res, next) => {
    console.log("Before upload middleware, req.body:", req.body);
    next();
  },
  upload.single("image"), // This must run BEFORE `saveDetection`
  (req, res, next) => {
    console.log("After upload middleware, req.file:", req.file);
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }
    next();
  },
  saveDetection
);

// Fetch all detections
router.get("/", getAllDetections);

// Route to retrieve an image from S3
router.get("/image/:imageKey", getImageFromS3);

// Get detection by instance ID
router.get("/:id", getDetectionById);


module.exports = router;
