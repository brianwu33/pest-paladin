const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * 🔹 Pair a Camera (POST)
 * ✅ Requires Authentication
 * ✅ Ensures camera is not already paired
 */
router.post("/pair", authMiddleware, async (req, res) => {
  try {
    const { cameraID, cameraName } = req.body;
    const userID = req.auth.userId; // Extract userId from JWT

    if (!cameraID || !cameraName) {
      return res.status(400).json({ error: "CameraID and CameraName are required" });
    }

    // Check if camera is already paired
    const existingCamera = await pool.query("SELECT * FROM cameras WHERE camera_id = $1", [cameraID]);

    if (existingCamera.rows.length > 0) {
      return res.status(409).json({ error: "This camera is already paired with another user" });
    }

    // Insert new camera pairing
    const query = `
      INSERT INTO cameras (camera_id, user_id, camera_name, paired_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *;
    `;
    const result = await pool.query(query, [cameraID, userID, cameraName]);

    res.status(201).json({ message: "Camera paired successfully", camera: result.rows[0] });
  } catch (error) {
    console.error("Error pairing camera:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * 🔹 Unpair a Camera (DELETE)
 * ✅ Requires Authentication
 * ✅ Only the owner can unpair their camera
 */
router.delete("/unpair/:cameraID", authMiddleware, async (req, res) => {
  try {
    const { cameraID } = req.params;
    const userID = req.auth.userId; // Extract userId from JWT

    // Ensure the user owns this camera before unpairing
    const camera = await pool.query("SELECT * FROM cameras WHERE camera_id = $1 AND user_id = $2", [cameraID, userID]);

    if (camera.rows.length === 0) {
      return res.status(404).json({ error: "Camera not found or you do not have permission to unpair it" });
    }

    // Delete camera from the database
    await pool.query("DELETE FROM cameras WHERE camera_id = $1 AND user_id = $2", [cameraID, userID]);

    res.status(200).json({ message: "Camera unpaired successfully" });
  } catch (error) {
    console.error("Error unpairing camera:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * 🔹 Fetch All Paired Cameras for a User (GET)
 * ✅ Requires Authentication
 * ✅ Returns all cameras linked to the authenticated user
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userID = req.auth.userId; // Extract userId from JWT

    const query = `
      SELECT camera_id, camera_name, paired_at
      FROM cameras
      WHERE user_id = $1
      ORDER BY paired_at DESC;
    `;
    const result = await pool.query(query, [userID]);

    res.status(200).json({ cameras: result.rows });
  } catch (error) {
    console.error("Error fetching cameras:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
