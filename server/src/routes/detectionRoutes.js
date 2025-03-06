const express = require("express");
const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const {
  upload,
  generatePresignedUrl,
  getImageFromS3,
} = require("../middlewares/upload");
const authMiddleware = require("../middlewares/authMiddleware"); // Import auth middleware

const router = express.Router();

/**
 * 🔹 Upload Detection Data (POST)
 * ✅ No Authentication Required - Used by Raspberry Pi
 */
router.post("/uploadDetection", upload.single("image"), async (req, res) => {
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

    // 🔹 Retrieve userID from `cameras` table (ensures camera is registered)
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

    res
      .status(201)
      .json({ message: "Upload successful", data: { image_key: imageKey } });
  } catch (error) {
    console.error("❌ Error saving detection:", error);
    res.status(500).json({ error: "Failed to save detection" });
  }
});

/**
 * 🔹 Fetch All Detections (GET) - Requires Authentication
 * ✅ Returns paginated list of detections
 * ✅ Only includes necessary fields for the Detections page
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userID = req.auth.userId; // Extract userId from JWT
    const page = parseInt(req.query.page) || 1; // Default page = 1
    const limit = parseInt(req.query.limit) || 10; // Default limit = 10
    const offset = (page - 1) * limit; // Calculate pagination offset

    // Get total count of detections for pagination
    const countResult = await pool.query(
      "SELECT COUNT(*) FROM detections WHERE user_id = $1",
      [userID]
    );
    const totalDetections = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalDetections / limit);

    // Query for paginated detections
    const query = `
      SELECT detection_id, timestamp, species, camera_name
      FROM detections
      WHERE user_id = $1
      ORDER BY timestamp DESC
      LIMIT $2 OFFSET $3;
    `;
    const result = await pool.query(query, [userID, limit, offset]);

    res.status(200).json({
      detections: result.rows,
      totalPages,
      currentPage: page,
    });
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

    // Retrieve detection details (excluding data already available in frontend)
    const query = `
      SELECT x_min, x_max, y_min, y_max, confidence, image_key
      FROM detections
      WHERE detection_id = $1 AND user_id = $2
    `;
    const result = await pool.query(query, [id, userID]);

    if (result.rows.length > 0) {
      const detection = result.rows[0];

      // Generate pre-signed URL for the image
      detection.image_url = generatePresignedUrl(detection.image_key);

      res.status(200).json(detection);
    } else {
      res.status(404).json({ error: "Detection not found or access denied" });
    }
  } catch (error) {
    console.error("❌ Error retrieving detection data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * 🔹 Retrieve Image from S3 (GET) - Public Access
 */
// router.get("/image/:imageKey", getImageFromS3); // No auth needed for S3 images

/**
 * 🔹 Delete a Single Detection (GET) - Public Access
 */
router.delete("/:detection_id", authMiddleware, async (req, res) => {
  try {
    const { detection_id } = req.params;
    const userID = req.auth.userId; // Extract userId from JWT

    // Ensure detection belongs to the authenticated user
    const detection = await pool.query(
      "SELECT * FROM detections WHERE detection_id = $1 AND user_id = $2",
      [detection_id, userID]
    );

    if (detection.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Detection not found or unauthorized" });
    }

    // Delete detection
    await pool.query("DELETE FROM detections WHERE detection_id = $1", [
      detection_id,
    ]);

    res.status(200).json({ message: "Detection deleted successfully" });
  } catch (error) {
    console.error("Error deleting detection:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Bulk Insert Endpoint - Adds 70 Detections (10 per day for last 7 days)
 */
router.post("/bulkInsert", async (req, res) => {
  try {
    const userID = "user_2tFGIt8y2A9ifAQsnBAzrfkmB7u";
    const imageKey = "1741260107182-f818ba0e-d689-4288-a856-59491308e935-image-min.png";
    const cameraNames = ["Garden", "Kitchen", "Garage", "Living Room"];
    const speciesList = ["Rat", "Cockroach", "Spider", "Dragonfly", "Lizard", "Ant", "Mouse"];
    const detectionsPerDay = 10;
    const days = 7;

    let insertData = [];
    let values = [];

    let index = 1; // For numbered placeholders ($1, $2, $3...)

    for (let dayOffset = 0; dayOffset < days; dayOffset++) {
      for (let i = 0; i < detectionsPerDay; i++) {
        // Generate a timestamp for each detection (spread across the day)
        let date = new Date();
        date.setDate(date.getDate() - dayOffset);
        date.setHours(Math.floor(Math.random() * 24)); // Random hour
        date.setMinutes(Math.floor(Math.random() * 60));
        date.setSeconds(Math.floor(Math.random() * 60));
        let timestamp = date.toISOString();

        // Generate random bounding box values
        let x_min = Math.floor(Math.random() * 50);
        let x_max = x_min + Math.floor(Math.random() * 300) + 50;
        let y_min = Math.floor(Math.random() * 50);
        let y_max = y_min + Math.floor(Math.random() * 300) + 50;

        // Add row values
        values.push(
          uuidv4(), timestamp, userID,
          cameraNames[Math.floor(Math.random() * cameraNames.length)], // Random camera
          imageKey, x_min, x_max, y_min, y_max,
          1, // class_id fixed as 1
          speciesList[Math.floor(Math.random() * speciesList.length)], // Random species
          (Math.random() * 0.15 + 0.85).toFixed(2) // Confidence 0.85 - 1.0
        );

        // Create placeholders for each value ($1, $2, ..., $12, $13, ...)
        insertData.push(`($${index}, $${index + 1}, $${index + 2}, $${index + 3}, $${index + 4}, 
                         $${index + 5}, $${index + 6}, $${index + 7}, $${index + 8}, $${index + 9}, 
                         $${index + 10}, $${index + 11})`);
        index += 12; // Move index for next row
      }
    }

    // Bulk insert query with numbered placeholders
    const query = `
      INSERT INTO detections 
      (detection_id, timestamp, user_id, camera_name, image_key, x_min, x_max, y_min, y_max, class_id, species, confidence)
      VALUES ${insertData.join(", ")}
    `;

    // Execute the query with values
    await pool.query(query, values);

    res.status(201).json({ message: "✅ Successfully inserted 70 detections!" });
  } catch (error) {
    console.error("❌ Error inserting bulk detections:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
