// const pool = require("../config/db");
// const AWS = require("aws-sdk");
// const { v4: uuidv4 } = require("uuid");

// const s3 = new AWS.S3();

// // Generate pre-signed URL for secure image access
// const generatePresignedUrl = (imageKey) => {
//   return s3.getSignedUrl("getObject", {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: imageKey,
//     Expires: 3600, // URL expires in 1 hour
//   });
// };

// // Raspberry Pi use this endpoint to post
// // const saveDetection = async (req, res) => {
// //   try {
// //     const { timestamp, userID, cameraID, detections } = req.body;
// //     const imageKey = req.file.key;

// //     // Check if detections is already an array (from JSON request)
// //     let parsedDetections = detections;
// //     if (typeof detections === "string") {
// //       try {
// //         parsedDetections = JSON.parse(detections);
// //       } catch (err) {
// //         console.error("JSON Parsing Error:", err);
// //         return res
// //           .status(400)
// //           .json({ error: "Invalid JSON format for detections" });
// //       }
// //     }

// //     console.log("Parsed Detections:", parsedDetections);
// //     if (!Array.isArray(parsedDetections) || parsedDetections.length === 0) {
// //       return res
// //         .status(400)
// //         .json({ error: "Detections must be a non-empty array" });
// //     }

// //     // Insert into detection_instance table
// //     const instanceQuery = `
// //           INSERT INTO detection_instance (timestamp, user_id, camera_id, image_key)
// //           VALUES ($1, $2, $3, $4)
// //           RETURNING instance_id;
// //       `;
// //     const instanceValues = [timestamp, userID, cameraID, imageKey];
// //     const instanceResult = await pool.query(instanceQuery, instanceValues);
// //     const instance_id = instanceResult.rows[0].instance_id;

// //     // Insert detections into PostgreSQL
// //     const detectionQuery = `
// //         INSERT INTO detections (instance_id, x_min, x_max, y_min, y_max, class, species, confidence)
// //         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
// //       `;

// //     for (const detection of parsedDetections) {
// //       if (
// //         detection.x_min == null ||
// //         detection.x_max == null ||
// //         detection.y_min == null ||
// //         detection.y_max == null
// //       ) {
// //         console.error("Invalid detection object:", detection);
// //         continue; // Skip this entry if required fields are missing
// //       }

// //       const detectionValues = [
// //         instance_id,
// //         detection.x_min,
// //         detection.x_max,
// //         detection.y_min,
// //         detection.y_max,
// //         detection.class,
// //         detection.species,
// //         detection.confidence,
// //       ];
// //       await pool.query(detectionQuery, detectionValues);
// //     }

// //     res.json({ message: "Upload successful", data: { instance_id, imageKey } });
// //   } catch (error) {
// //     console.error("Error saving detection instance:", error);
// //     res.status(500).json({ error: "Failed to save detection" });
// //   }
// // };

// const saveDetection = async (req, res) => {
//   try {
//     const { timestamp, cameraID, detections } = req.body;
//     const imageKey = req.file?.key || null; // Handle missing images

//     // Validate detections
//     let parsedDetections = detections;
//     if (typeof detections === "string") {
//       try {
//         parsedDetections = JSON.parse(detections);
//       } catch (err) {
//         console.error("JSON Parsing Error:", err);
//         return res
//           .status(400)
//           .json({ error: "Invalid JSON format for detections" });
//       }
//     }

//     if (!Array.isArray(parsedDetections) || parsedDetections.length === 0) {
//       return res
//         .status(400)
//         .json({ error: "Detections must be a non-empty array" });
//     }

//     // 🔹 Retrieve userID from `cameras` table (ensures camera is registered)
//     const userResult = await pool.query(
//       "SELECT user_id FROM cameras WHERE camera_id = $1",
//       [cameraID]
//     );
//     if (userResult.rows.length === 0) {
//       return res
//         .status(404)
//         .json({ error: "Camera is not paired with any user" });
//     }
//     const userID = userResult.rows[0].user_id;

//     // Insert detection instance
//     const instanceQuery = `
//       INSERT INTO detection_instance (timestamp, user_id, camera_id, image_key)
//       VALUES ($1, $2, $3, $4)
//       RETURNING instance_id;
//     `;
//     const instanceValues = [timestamp, userID, cameraID, imageKey];
//     const instanceResult = await pool.query(instanceQuery, instanceValues);
//     const instance_id = instanceResult.rows[0].instance_id;

//     // Insert detections into `detections` table
//     const detectionQuery = `
//       INSERT INTO detections (instance_id, x_min, x_max, y_min, y_max, class, species, confidence)
//       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
//     `;

//     for (const detection of parsedDetections) {
//       if (
//         !detection.x_min ||
//         !detection.x_max ||
//         !detection.y_min ||
//         !detection.y_max
//       ) {
//         continue; // Skip invalid detections
//       }

//       const detectionValues = [
//         instance_id,
//         detection.x_min,
//         detection.x_max,
//         detection.y_min,
//         detection.y_max,
//         detection.class,
//         detection.species,
//         detection.confidence,
//       ];
//       await pool.query(detectionQuery, detectionValues);
//     }

//     res.json({ message: "Upload successful", data: { instance_id, imageKey } });
//   } catch (error) {
//     console.error("Error saving detection:", error);
//     res.status(500).json({ error: "Failed to save detection" });
//   }
// };

// /**
//  * 🔹 Fetch All Detections (GET) - Requires Authentication
//  */
// const getAllDetections = async (req, res) => {
//   try {
//     const userID = req.auth.userId; // Extract userId from JWT

//     const query = `
//       SELECT * FROM detection_instance 
//       WHERE user_id = $1
//       ORDER BY timestamp DESC;
//     `;
//     const result = await pool.query(query, [userID]);

//     // Attach pre-signed URLs to each detection record
//     const processedDetections = result.rows.map((row) => ({
//       ...row,
//       imageUrl: generatePresignedUrl(row.image_key), // Secure image access
//     }));

//     res.status(200).json(processedDetections);
//   } catch (error) {
//     console.error("Error retrieving detection data:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// /**
//  * 🔹 Fetch a Single Detection by ID (GET) - Requires Authentication
//  */
// const getDetectionById = async (req, res) => {
//   const { id } = req.params;
//   const userID = req.auth.userId; // Extract userId from JWT

//   try {
//     if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
//       return res.status(400).json({ error: "Invalid UUID format" });
//     }

//     // Retrieve detection only if it belongs to the authenticated user
//     const result = await pool.query(
//       "SELECT * FROM detection_instance WHERE instance_id = $1 AND user_id = $2",
//       [id, userID]
//     );

//     if (result.rows.length > 0) {
//       const detection = result.rows[0];
//       detection.imageUrl = generatePresignedUrl(detection.image_key);
//       res.status(200).json(detection);
//     } else {
//       res.status(404).json({ error: "Detection instance not found" });
//     }
//   } catch (error) {
//     console.error("Error retrieving detection data:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// module.exports = {
//   saveDetection,
//   getAllDetections,
//   getDetectionById,
// };
