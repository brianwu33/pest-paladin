const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/yesterday", async (req, res) => {
    try {
      const yesterdayStart = new Date();
      yesterdayStart.setDate(yesterdayStart.getDate() - 1);
      yesterdayStart.setHours(0, 0, 0, 0);
  
      const yesterdayEnd = new Date(yesterdayStart);
      yesterdayEnd.setHours(23, 59, 59, 999);
  
      const metrics = await db.one(`
        SELECT 
          COUNT(*) AS total_detections,
          COALESCE(ROUND(AVG(duration), 2), 0) AS avg_duration,
          (SELECT species FROM detections WHERE time BETWEEN $1 AND $2 GROUP BY species ORDER BY COUNT(*) DESC LIMIT 1) AS most_frequent_species,
          (SELECT id, time, species FROM detections WHERE time BETWEEN $1 AND $2 ORDER BY time DESC LIMIT 1) AS latest_detection
        FROM detections WHERE time BETWEEN $1 AND $2
      `, [yesterdayStart, yesterdayEnd]);
  
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching yesterday's metrics:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
// Get Peak Activity Times (Last 7 Days)
router.get("/peak-activity", async (req, res) => {
  try {
    const activity = await db.any(`
      SELECT 
        DATE_TRUNC('hour', time) AS hour, 
        species, 
        COUNT(*) AS count
      FROM detections
      WHERE time >= NOW() - INTERVAL '7 days'
      GROUP BY hour, species
      ORDER BY hour ASC
    `);

    res.json(activity);
  } catch (error) {
    console.error("Error fetching peak activity:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Pest Type Distribution (Pie Chart Data)
router.get("/pest-distribution", async (req, res) => {
  try {
    const distribution = await db.any(`
      SELECT species, COUNT(*) AS count
      FROM detections
      WHERE time >= NOW() - INTERVAL '7 days'
      GROUP BY species
      ORDER BY count DESC
    `);

    res.json(distribution);
  } catch (error) {
    console.error("Error fetching pest distribution:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Daily Detection Trend (Last 7 Days)
router.get("/daily-trend", async (req, res) => {
  try {
    const trend = await db.any(`
      SELECT 
        DATE(time) AS day, 
        COUNT(*) AS count
      FROM detections
      WHERE time >= NOW() - INTERVAL '7 days'
      GROUP BY day
      ORDER BY day ASC
    `);

    res.json(trend);
  } catch (error) {
    console.error("Error fetching daily trend:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Location-Based Detection Distribution
router.get("/location-distribution", async (req, res) => {
  try {
    const locations = await db.any(`
      SELECT camera, COUNT(*) AS count
      FROM detections
      WHERE time >= NOW() - INTERVAL '7 days'
      GROUP BY camera
      ORDER BY count DESC
    `);

    res.json(locations);
  } catch (error) {
    console.error("Error fetching location distribution:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
