const express = require("express");
const db = require("../config/db.js");

const router = express.Router();

// Get yesterday's analytics
router.get("/yesterday", async (req, res) => {
  try {
    const yesterdayStart = new Date();
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    yesterdayStart.setHours(0, 0, 0, 0);

    const yesterdayEnd = new Date(yesterdayStart);
    yesterdayEnd.setHours(23, 59, 59, 999);

    const metrics = await db.one(`
      SELECT 
        COUNT(d.id) AS total_detections,
        (SELECT d.species 
         FROM detections d 
         WHERE d.timestamp BETWEEN $1 AND $2 
         GROUP BY d.species 
         ORDER BY COUNT(*) DESC 
         LIMIT 1) AS most_frequent_species,
        (SELECT d.id, d.timestamp, d.species 
         FROM detections d 
         WHERE d.timestamp BETWEEN $1 AND $2 
         ORDER BY d.timestamp DESC 
         LIMIT 1) AS latest_detection
      FROM detections d
      WHERE d.timestamp BETWEEN $1 AND $2
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
        DATE_TRUNC('hour', d.timestamp) AS hour, 
        d.species, 
        COUNT(*) AS count
      FROM detections d
      WHERE d.timestamp >= NOW() - INTERVAL '7 days'
      GROUP BY hour, d.species
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
      SELECT d.species, COUNT(*) AS count
      FROM detections d
      WHERE d.timestamp >= NOW() - INTERVAL '7 days'
      GROUP BY d.species
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
        DATE(d.timestamp) AS day, 
        COUNT(*) AS count
      FROM detections d
      WHERE d.timestamp >= NOW() - INTERVAL '7 days'
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
      SELECT di.camera_id, COUNT(d.id) AS count
      FROM detections d
      JOIN detection_instance di ON d.instance_id = di.instance_id
      WHERE d.timestamp >= NOW() - INTERVAL '7 days'
      GROUP BY di.camera_id
      ORDER BY count DESC
    `);

    res.json(locations);
  } catch (error) {
    console.error("Error fetching location distribution:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
