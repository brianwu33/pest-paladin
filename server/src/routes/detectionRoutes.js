const express = require("express");
const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const { generatePresignedUrl, getImageFromS3 } = require("../utils/awsUtil");
const authMiddleware = require("../middlewares/authMiddleware"); // Import auth middleware

const router = express.Router();

/**
 * 🔹 Fetch All Detections (GET) - Requires Authentication
 * ✅ Returns paginated list of detections
 * ✅ Only includes necessary fields for the Detections page
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userID = req.auth.userId; // Extract userId from JWT
    const page = parseInt(req.query.page) || 1; // Default page = 1
    const limit = parseInt(req.query.limit) || 15; // Default limit = 10
    console.log("Page Size: " + limit);
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
      SELECT detection_id, timestamp, species, camera_name, read
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
  const userID = req.auth.userId;

  try {
    if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
      return res.status(400).json({ error: "Invalid UUID format" });
    }

    const query = `
      SELECT x_min, x_max, y_min, y_max, confidence, image_key, cropped_image_key
      FROM detections
      WHERE detection_id = $1 AND user_id = $2
    `;
    const result = await pool.query(query, [id, userID]);

    if (result.rows.length > 0) {
      const detection = result.rows[0];

      // Include both image URLs
      detection.image_url = generatePresignedUrl(detection.image_key);
      detection.cropped_image_url = generatePresignedUrl(
        detection.cropped_image_key
      );

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

router.put("/:id/read", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { read } = req.body; // Boolean value for read status
  const userID = req.auth.userId;

  try {
    const result = await pool.query(
      "UPDATE detections SET read = $1 WHERE detection_id = $2 AND user_id = $3 RETURNING *",
      [read, id, userID]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Detection not found or unauthorized" });
    }

    res.status(200).json({ message: `Detection marked as ${read ? "read" : "unread"}` });
  } catch (error) {
    console.error("❌ Error updating read status:", error);
    res.status(500).json({ error: "Failed to update read status" });
  }
});


/**
 * Bulk Insert Endpoint - Adds 70 Detections (10 per day for last 7 days)
 */
router.post("/bulkInsert", async (req, res) => {
  try {
    const userID = "user_2tFGIt8y2A9ifAQsnBAzrfkmB7u";
    const imageKey =
      "1741665762731-03d79f34-d67c-4982-8dd2-fa65c020eab9-original.jpg";
    const croppedImageKey = "1741665763152-08b77aa9-32ba-43f7-a790-3f51cb65443c-cropped.jpg"; // Sample cropped image key
    const cameraNames = ["Garden", "Kitchen", "Garage", "Living Room"];
    const speciesList = [
      "Rat",
      "Cockroach",
      "Spider",
      "Dragonfly",
      "Lizard",
      "Ant",
      "Mouse",
    ];
    const detectionsPerDay = 10;
    const days = 7;

    let insertData = [];
    let values = [];

    let index = 1;

    for (let dayOffset = 1; dayOffset < days; dayOffset++) {
      for (let i = 0; i < detectionsPerDay; i++) {
        let date = new Date();
        date.setDate(date.getDate() - dayOffset);
        date.setHours(Math.floor(Math.random() * 24));
        date.setMinutes(Math.floor(Math.random() * 60));
        date.setSeconds(Math.floor(Math.random() * 60));
        let timestamp = date.toISOString();

        let x_min = Math.floor(Math.random() * 50);
        let x_max = x_min + Math.floor(Math.random() * 300) + 50;
        let y_min = Math.floor(Math.random() * 50);
        let y_max = y_min + Math.floor(Math.random() * 300) + 50;

        values.push(
          uuidv4(),
          timestamp,
          userID,
          cameraNames[Math.floor(Math.random() * cameraNames.length)],
          imageKey,
          croppedImageKey,
          x_min,
          x_max,
          y_min,
          y_max,
          1,
          speciesList[Math.floor(Math.random() * speciesList.length)],
          (Math.random() * 0.15 + 0.85).toFixed(2)
        );

        insertData.push(`($${index}, $${index + 1}, $${index + 2}, $${
          index + 3
        }, $${index + 4}, 
                         $${index + 5}, $${index + 6}, $${index + 7}, $${
          index + 8
        }, $${index + 9}, 
                         $${index + 10}, $${index + 11}, $${index + 12})`);
        index += 13;
      }
    }

    const query = `
      INSERT INTO detections 
      (detection_id, timestamp, user_id, camera_name, image_key, cropped_image_key, 
      x_min, x_max, y_min, y_max, class_id, species, confidence)
      VALUES ${insertData.join(", ")}
    `;

    await pool.query(query, values);

    res
      .status(201)
      .json({ message: "✅ Successfully inserted 70 detections!" });
  } catch (error) {
    console.error("❌ Error inserting bulk detections:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
