const express = require("express");
const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const { uploadImageToS3, cropImage } = require("../utils/awsUtil"); // Updated Imports
const uploadImage = require("../middlewares/imageUploadMiddleware"); // ✅ New Middleware
const { sendNotificationToUser } = require("../websocket");

const router = express.Router();

/**
 * 🔹 Upload Detection Data (POST)
 * ✅ No Authentication Required - Used by Raspberry Pi
 */
router.post("/", uploadImage.single("image"), async (req, res) => {
  try {
    const { cameraID, detections } = req.body;
    const originalImageBuffer = req.file?.buffer; // ✅ Extract the uploaded image directly

    if (!originalImageBuffer) {
      return res.status(400).json({ error: "Original image is required" });
    }

    const originalImageKey = await uploadImageToS3(originalImageBuffer, true); // ✅ Original Image Upload

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

    const detectionQuery = `
          INSERT INTO detections (detection_id, user_id, camera_name, image_key, cropped_image_key, 
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

      const croppedImageBuffer = await cropImage(
        originalImageBuffer,
        detection.x_min,
        detection.x_max,
        detection.y_min,
        detection.y_max
      );

      const croppedImageKey = await uploadImageToS3(croppedImageBuffer, false); // ✅ Cropped Image Upload

      const detectionValues = [
        uuidv4(),
        userID,
        cameraName,
        originalImageKey,
        croppedImageKey,
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

    sendNotificationToUser(userID, {
      title: "New Detection Alert!",
      message: "A new detection has been reported. Click to view live feed.",
      link: "/live-feed",
    });

    res.status(201).json({
      message: "Upload successful",
      data: { image_key: originalImageKey },
    });
  } catch (error) {
    console.error("❌ Error saving detection:", error);
    res.status(500).json({ error: "Failed to save detection" });
  }
});

module.exports = router;