const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * 🔹 Fetch Dashboard Analytics Data (GET) - Requires Authentication
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userID = req.auth.userId; // Extract userId from JWT

    // Get today's total detections
    const totalDetectionsQuery = `
      SELECT COUNT(*) AS total_detections
      FROM detections
      WHERE user_id = $1 AND DATE(timestamp) = CURRENT_DATE;
    `;
    const totalDetectionsResult = await pool.query(totalDetectionsQuery, [
      userID,
    ]);
    const totalDetections =
      parseInt(totalDetectionsResult.rows[0].total_detections) || 0;

    // Get the most frequent species
    const mostFrequentSpeciesQuery = `
      SELECT species, COUNT(*) AS count
      FROM detections
      WHERE user_id = $1 AND DATE(timestamp) = CURRENT_DATE
      GROUP BY species
      ORDER BY count DESC
      LIMIT 1;
    `;
    const mostFrequentSpeciesResult = await pool.query(
      mostFrequentSpeciesQuery,
      [userID]
    );
    const mostFrequentSpecies =
      mostFrequentSpeciesResult.rows.length > 0
        ? mostFrequentSpeciesResult.rows[0].species
        : "N/A";

    // Get the most detections camera
    const mostDetectionCameraQuery = `
      SELECT camera_name, COUNT(*) AS count
      FROM detections
      WHERE user_id = $1 AND DATE(timestamp) = CURRENT_DATE
      GROUP BY camera_name
      ORDER BY count DESC
      LIMIT 1;
    `;
    const mostDetectionCameraResult = await pool.query(
      mostDetectionCameraQuery,
      [userID]
    );
    const mostDetectionCamera =
      mostDetectionCameraResult.rows.length > 0
        ? mostDetectionCameraResult.rows[0].camera_name
        : "N/A";

    // Get the most recent detection timestamp
    const latestDetectionQuery = `
      SELECT timestamp
      FROM detections
      WHERE user_id = $1
      ORDER BY timestamp DESC
      LIMIT 1;
    `;
    const latestDetectionResult = await pool.query(latestDetectionQuery, [
      userID,
    ]);
    const latestDetection =
      latestDetectionResult.rows.length > 0
        ? latestDetectionResult.rows[0].timestamp
        : null;

    // **Peak Activity Times (4-hour periods)**
    const detectionsQuery = `
      SELECT timestamp
      FROM detections
      WHERE user_id = $1 AND timestamp >= NOW() - INTERVAL '7 days';
    `;
    const detectionsResult = await pool.query(detectionsQuery, [userID]);
    const detections = detectionsResult.rows.map(
      (row) => new Date(row.timestamp)
    );

    // **Process Peak Activity Data in JavaScript**
    const timeBins = {
      "12AM": 0, // 10PM - 2AM
      "4AM": 0, // 2AM - 6AM
      "8AM": 0, // 6AM - 10AM
      "12PM": 0, // 10AM - 2PM
      "4PM": 0, // 2PM - 6PM
      "8PM": 0, // 6PM - 10PM
    };

    detections.forEach((timestamp) => {
      const hour = timestamp.getHours();

      if (hour >= 22 || hour < 2) timeBins["12AM"]++;
      else if (hour >= 2 && hour < 6) timeBins["4AM"]++;
      else if (hour >= 6 && hour < 10) timeBins["8AM"]++;
      else if (hour >= 10 && hour < 14) timeBins["12PM"]++;
      else if (hour >= 14 && hour < 18) timeBins["4PM"]++;
      else if (hour >= 18 && hour < 22) timeBins["8PM"]++;
    });

    // **Convert Object to Array for Frontend**
    const peakActivityData = Object.keys(timeBins).map((time) => ({
      time,
      count: timeBins[time],
    }));

    // Pest Type Distribution (Top 5 + "Others")
    const pestDistributionQuery = `
      SELECT species, COUNT(*) AS count
      FROM detections
      WHERE user_id = $1 AND timestamp >= NOW() - INTERVAL '7 days'
      GROUP BY species
      ORDER BY count DESC;
    `;
    const pestDistributionResult = await pool.query(pestDistributionQuery, [
      userID,
    ]);

    const totalPests = pestDistributionResult.rows.reduce(
      (sum, row) => sum + parseInt(row.count),
      0
    );

    let pestTypeData = [];
    let top5Sum = 0;

    pestDistributionResult.rows.slice(0, 5).forEach((row) => {
      const percentage = Math.round((row.count / totalPests) * 100);
      pestTypeData.push({ name: row.species, value: percentage });
      top5Sum += percentage;
    });

    // Correct "Others" to be 100 - sum of the top 5
    if (totalPests > 0 && top5Sum < 100) {
      pestTypeData.push({ name: "Others", value: 100 - top5Sum });
    }

    // Daily Detection Trend (Last 7 Days)
    const dailyTrendQuery = `
      SELECT DATE(timestamp) AS date, COUNT(*)::int AS count
      FROM detections
      WHERE user_id = $1 AND timestamp >= NOW() - INTERVAL '7 days'
      GROUP BY date
      ORDER BY date;
    `;
    const dailyTrendResult = await pool.query(dailyTrendQuery, [userID]);

    const dailyDetectionTrend = Array(7)
      .fill(0)
      .map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const formattedDate = `${date.getMonth() + 1}.${date.getDate()}`;

        return {
          date: formattedDate,
          count:
            dailyTrendResult.rows.find(
              (row) =>
                row.date.toISOString().split("T")[0] ===
                date.toISOString().split("T")[0]
            )?.count || 0, // `count` is already an integer from SQL
        };
      });

    // Camera Distribution (Top 5 + "Others")
    const cameraDistributionQuery = `
      SELECT camera_name, COUNT(*) AS count
      FROM detections
      WHERE user_id = $1 AND timestamp >= NOW() - INTERVAL '7 days'
      GROUP BY camera_name
      ORDER BY count DESC;
    `;
    const cameraDistributionResult = await pool.query(cameraDistributionQuery, [
      userID,
    ]);

    const totalCameras = cameraDistributionResult.rows.reduce(
      (sum, row) => sum + parseInt(row.count),
      0
    );

    let cameraData = [];
    let top5CameraSum = 0;

    cameraDistributionResult.rows.slice(0, 5).forEach((row) => {
      const percentage = Math.round((row.count / totalCameras) * 100);
      cameraData.push({ name: row.camera_name, value: percentage });
      top5CameraSum += percentage;
    });

    // Correct "Others" to be 100 - sum of the top 5
    if (totalCameras > 0 && top5CameraSum < 100) {
      cameraData.push({ name: "Others", value: 100 - top5CameraSum });
    }

    res.status(200).json({
      totalDetections,
      mostFrequentSpecies,
      mostDetectionCamera,
      latestDetection,
      peakActivityData,
      pestTypeData,
      dailyDetectionTrend,
      cameraData,
    });
  } catch (error) {
    console.error("❌ Error retrieving dashboard analytics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
