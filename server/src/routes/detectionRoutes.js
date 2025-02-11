const express = require("express");
const pool = require("../config/db");
const sharp = require("sharp");
const multer = require("multer");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Insert object detection data
router.post("/", upload.single("image"), async (req, res) => {
  const { timestamp, userID, cameraID, Detections } = JSON.parse(req.body.data);
  const imageBuffer = req.file.buffer;

  if (!timestamp) {
    return res.status(400).json({ error: "Timestamp is missing" });
  }

  try {
    const client = await pool.connect();

    for (const detection of Detections) {
      const { instanceID, xmin, xmax, ymin, ymax, species, confidence } = detection;

      // Crop the image based on detection bounding box
      const speciesCaptureImage = await sharp(imageBuffer)
        .extract({ left: Math.round(xmin), top: Math.round(ymin), width: Math.round(xmax - xmin), height: Math.round(ymax - ymin) })
        .toBuffer();

      // Check if the instance already exists
      const result = await client.query("SELECT * FROM detection_instance WHERE instance_id = $1", [instanceID]);

      if (result.rows.length > 0) {
        // Update existing instance
        await client.query(
          `UPDATE detection_instance SET timestamplist = array_append(timestamplist, $1) WHERE instance_id = $2`,
          [timestamp, instanceID]
        );
      } else {
        await client.query(
          `INSERT INTO detection_instance (instance_id, species, confidence, user_id, camera_id, camera_capture_image, species_capture_image, timestamplist)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [instanceID, species, confidence, userID, cameraID, imageBuffer, speciesCaptureImage, [timestamp]]
        );
      }
    }

    client.release();
    res.status(201).json({ message: "Detections processed successfully" });
  } catch (error) {
    console.error("Error processing detections:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch object detection data
router.get("/", async (req, res) => {
  try {
    const client = await pool.connect();
    const query = `
        SELECT * FROM detection_instance 
        ORDER BY timestamplist[1] DESC
    `;
    const result = await client.query(query);
    client.release();
    res.status(200).json(result.rows);
  } catch (error) {
      console.error('Error retrieving detection data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get the smallest missing instance ID
router.get("/smallest-missing-id", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT instance_id FROM detection_instance ORDER BY instance_id ASC');
    client.release();

    const instanceIds = result.rows.map(row => row.instance_id);
    let smallestMissingId = 1;

    for (let i = 0; i < instanceIds.length; i++) {
        if (instanceIds[i] !== smallestMissingId) {
            break;
        }
        smallestMissingId++;
    }

    res.status(200).json({ smallest_missing_instance_id: smallestMissingId });
  } catch (error) {
      console.error('Error retrieving smallest missing instance ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get detection by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM detection_instance WHERE instance_id = $1', [id]);
      client.release();

      if (result.rows.length > 0) {
          res.status(200).json(result.rows[0]);
      } else {
          res.status(404).json({ error: 'Detection instance not found' });
      }
  } catch (error) {
      console.error('Error retrieving detection data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete detection by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
      const client = await pool.connect();
      const result = await client.query('DELETE FROM detection_instance WHERE instance_id = $1 RETURNING *', [id]);
      client.release();

      if (result.rowCount > 0) {
          res.status(200).json({ message: 'Detection instance deleted successfully' });
      } else {
          res.status(404).json({ error: 'Detection instance not found' });
      }
  } catch (error) {
      console.error('Error deleting detection data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;