const pool = require("../config/db");
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

  
const saveDetection = async (req, res) => {
    try {
      const { timestamp, userID, cameraID, detections } = req.body;
      const imageKey = req.file.key;
  
      // Check if detections is already an array (from JSON request)
      let parsedDetections = detections;
      if (typeof detections === "string") {
        try {
          parsedDetections = JSON.parse(detections);
        } catch (err) {
          console.error("JSON Parsing Error:", err);
          return res.status(400).json({ error: "Invalid JSON format for detections" });
        }
      }
  
      console.log("Parsed Detections:", parsedDetections);
      if (!Array.isArray(parsedDetections) || parsedDetections.length === 0) {
        return res.status(400).json({ error: "Detections must be a non-empty array" });
      }
  
      // Insert into detection_instance table
      const instanceQuery = `
          INSERT INTO detection_instance (timestamp, user_id, camera_id, image_key)
          VALUES ($1, $2, $3, $4)
          RETURNING instance_id;
      `;
      const instanceValues = [timestamp, userID, cameraID, imageKey];
      const instanceResult = await pool.query(instanceQuery, instanceValues);
      const instance_id = instanceResult.rows[0].instance_id;
    
      // Insert detections into PostgreSQL
      const detectionQuery = `
        INSERT INTO detections (instance_id, x_min, x_max, y_min, y_max, class, species, confidence)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `;
  
      for (const detection of parsedDetections) {  
        if (detection.x_min == null || detection.x_max == null || detection.y_min == null || detection.y_max == null) {
          console.error("Invalid detection object:", detection);
          continue; // Skip this entry if required fields are missing
        }
  
        const detectionValues = [
          instance_id,
          detection.x_min, detection.x_max,
          detection.y_min, detection.y_max,
          detection.class, detection.species, detection.confidence
        ];
        await pool.query(detectionQuery, detectionValues);
      }
  
      res.json({ message: "Upload successful", data: { instance_id, imageKey } });
  
    } catch (error) {
      console.error("Error saving detection instance:", error);
      res.status(500).json({ error: "Failed to save detection" });
    }
};
const getAllDetections = async (req, res) => {
    try {
      const query = `
          SELECT * FROM detection_instance 
          ORDER BY timestamp DESC
      `;
      const result = await pool.query(query);
  
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
    if (!isUuid(id)) {
      console.error("Invalid UUID format:", id);
      return res.status(400).json({ error: "Invalid UUID format" });
    }
  
    try {
      const result = await pool.query(
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


