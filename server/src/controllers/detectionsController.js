const db = require("../config/db");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3();

// Generate pre-signed URL for secure image access
const generatePresignedUrl = (imageKey) => {
    return s3.getSignedUrl("getObject", {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageKey,
      Expires: 3600 // URL expires in 1 hour
    });
  };

// Store detection metadata in PostgreSQL
const saveDetection = async (req, res) => {
  try {
    const { timestamp, userID, cameraID, detections } = req.body;
    const imageKey = req.file.key;

    const detectionId = uuidv4();
    const query = `
        INSERT INTO detections (id, timestamp, user_id, camera_id, image_key, detections)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    const values = [detectionId, timestamp, userID, cameraID, imageKey, detections];

    const result = await db.query(query, values);
    res.json({ message: 'Upload successful', data: result.rows[0] });

  } catch (error) {
    console.error("Error saving detection:", error);
    res.status(500).json({ error: "Failed to save detection" });
  }
};

// Fetch all object detection data (Includes pre-signed image URLs)
const getAllDetections = async (req, res) => {
    try {
      const query = `
          SELECT * FROM detection_instance 
          ORDER BY timestamplist[1] DESC
      `;
      const result = await db.query(query);
  
      // Attach pre-signed URLs to each detection record
      const processedDetections = result.rows.map(row => ({
        ...row,
        imageUrl: generatePresignedUrl(row.image_key) // Add secure image URL
      }));
  
      res.status(200).json(processedDetections);
    } catch (error) {
      console.error("Error retrieving detection data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  // Get a single detection by ID
  const getDetectionById = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await db.query(
        "SELECT * FROM detection_instance WHERE instance_id = $1",
        [id]
      );
  
      if (result.rows.length > 0) {
        const detection = result.rows[0];
        detection.imageUrl = generatePresignedUrl(detection.image_key);
        res.status(200).json(detection);
      } else {
        res.status(404).json({ error: "Detection instance not found" });
      }
    } catch (error) {
      console.error("Error retrieving detection data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

module.exports = {
  saveDetection,
  getAllDetections,
  getDetectionById,
};


