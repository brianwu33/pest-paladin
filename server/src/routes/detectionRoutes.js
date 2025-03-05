const express = require("express");
const pool = require("../config/db");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const { upload, getImageFromS3 } = require("../middlewares/upload");
const authMiddleware = require("../middlewares/authMiddleware"); // Import auth middleware

const router = express.Router();
const s3 = new AWS.S3();

// 🔹 Generate pre-signed URL for secure image access
const generatePresignedUrl = (imageKey) => {
  return s3.getSignedUrl("getObject", {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: imageKey,
    Expires: 3600, // URL expires in 1 hour
  });
};

/**
 * 🔹 Upload Detection Data (POST)
 * ✅ No Authentication Required - Used by Raspberry Pi
 */
router.post(
  "/uploadDetection",
  upload.single("image"),
  async (req, res) => {
    try {
      const { timestamp, cameraID, detections } = req.body;
      const imageKey = req.file?.key || null; // Handle missing images

      // Validate and parse detections
      let parsedDetections = detections;
      if (typeof detections === "string") {
        try {
          parsedDetections = JSON.parse(detections);
        } catch (err) {
          console.error("JSON Parsing Error:", err);
          return res.status(400).json({ error: "Invalid JSON format for detections" });
        }
      }

      if (!Array.isArray(parsedDetections) || parsedDetections.length === 0) {
        return res.status(400).json({ error: "Detections must be a non-empty array" });
      }

      // 🔹 Retrieve userID from `cameras` table (ensures camera is registered)
      const userResult = await pool.query(
        "SELECT user_id, camera_name FROM cameras WHERE camera_id = $1",
        [cameraID]
      );
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: "Camera is not paired with any user" });
      }
      const { user_id: userID, camera_name: cameraName } = userResult.rows[0];

      // 🔹 Insert detections into `detections` table
      const detectionQuery = `
        INSERT INTO detections (detection_id, timestamp, user_id, camera_name, image_key, 
        x_min, x_max, y_min, y_max, class_id, species, confidence)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `;

      for (const detection of parsedDetections) {
        if (
          detection.x_min == null ||
          detection.x_max == null ||
          detection.y_min == null ||
          detection.y_max == null
        ) {
          console.error("Invalid detection object:", detection);
          continue; // Skip invalid detections
        }

        const detectionValues = [
          uuidv4(), // Generate unique UUID for detection_id
          timestamp,
          userID,
          cameraName,
          imageKey,
          detection.x_min,
          detection.x_max,
          detection.y_min,
          detection.y_max,
          detection.class,
          detection.species,
          detection.confidence,
        ];
        await pool.query(detectionQuery, detectionValues);
      }

      res.status(201).json({ message: "Upload successful", data: { image_key: imageKey } });
    } catch (error) {
      console.error("❌ Error saving detection:", error);
      res.status(500).json({ error: "Failed to save detection" });
    }
  }
);

/**
 * 🔹 Fetch All Detections (GET) - Requires Authentication
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userID = req.auth.userId; // Extract userId from JWT

    const query = `
      SELECT detection_id, timestamp, species, camera_name
      FROM detections 
      WHERE user_id = $1
      ORDER BY timestamp DESC;
    `;
    const result = await pool.query(query, [userID]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error retrieving detection data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * 🔹 Fetch a Single Detection by ID (GET) - Requires Authentication
 */
router.get("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userID = req.auth.userId; // Extract userId from JWT

  try {
    if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
      return res.status(400).json({ error: "Invalid UUID format" });
    }

    // Retrieve detection only if it belongs to the authenticated user
    const result = await pool.query(
      "SELECT * FROM detection_instance WHERE instance_id = $1 AND user_id = $2",
      [id, userID]
    );

    if (result.rows.length > 0) {
      const detection = result.rows[0];
      detection.imageUrl = generatePresignedUrl(detection.image_key);
      res.status(200).json(detection);
    } else {
      res.status(404).json({ error: "Detection instance not found" });
    }
  } catch (error) {
    console.error("❌ Error retrieving detection data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * 🔹 Retrieve Image from S3 (GET) - Public Access
 */
router.get("/image/:imageKey", getImageFromS3); // No auth needed for S3 images

module.exports = router;
