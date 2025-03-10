const express = require("express");
const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const { upload } = require("../middlewares/upload");
const { sendNotificationToUser } = require("../websocket"); // ✅ Correct Import

const router = express.Router();

/**
 * 🔹 Upload Detection Data (POST)
 * ✅ No Authentication Required - Used by Raspberry Pi
 */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { timestamp, cameraID, detections } = req.body;
    const imageKey = req.file?.key || null;

    let parsedDetections = detections;
    if (typeof detections === "string") {
      try {
        parsedDetections = JSON.parse(detections);
      } catch (err) {
        console.error("JSON Parsing Error:", err);
        return res
          .status(400)
          .json({ error: "Invalid JSON format for detections" });
      }
    }

    if (!Array.isArray(parsedDetections) || parsedDetections.length === 0) {
      return res
        .status(400)
        .json({ error: "Detections must be a non-empty array" });
    }

    const userResult = await pool.query(
      "SELECT user_id, camera_name FROM cameras WHERE camera_id = $1",
      [cameraID]
    );
    if (userResult.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Camera is not paired with any user" });
    }

    const { user_id: userID, camera_name: cameraName } = userResult.rows[0];

    // Insert detections into `detections` table
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
        continue;
      }

      const detectionValues = [
        uuidv4(),
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

    // Send notification to the specific user
    sendNotificationToUser(userID, {
      title: "New Detection Alert!",
      message: "A new detection has been reported. Click to view live feed.",
      link: "/live-feed",
    });

    res.status(201).json({
      message: "Upload successful",
      data: { image_key: imageKey },
    });
  } catch (error) {
    console.error("❌ Error saving detection:", error);
    res.status(500).json({ error: "Failed to save detection" });
  }
});

module.exports = router;
