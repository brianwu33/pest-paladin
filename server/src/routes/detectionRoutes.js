const express = require("express");
const { upload, getImageFromS3 } = require("../middlewares/upload");
const {
  saveDetection,
  getAllDetections,
  getDetectionById,
} = require("../services/detectionService");
const authMiddleware = require("../middlewares/authMiddleware"); // Import auth middleware

const router = express.Router();

// 🔓 Allow all cameras to upload detection data (NO AUTH)
router.post(
  "/uploadDetection",
  (req, res, next) => {
    console.log("Before upload middleware, req.body:", req.body);
    next();
  },
  upload.single("image"),
  (req, res, next) => {
    console.log("After upload middleware, req.file:", req.file);
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }
    next();
  },
  saveDetection
);

// 🔐 Require authentication for all user requests (web & mobile)
router.get("/", authMiddleware, getAllDetections);
router.get("/:id", authMiddleware, getDetectionById);
router.get("/image/:imageKey", getImageFromS3); // No auth needed for S3 images

module.exports = router;
