require("dotenv").config();

// setup code
const express = require("express");
const bodyParser = require('body-parser');
const {Pool} = require('pg')

// database
//const db = require("./db"); // it will automatically look for index.js
const morgan = require("morgan");
const app = express(); // create an instance of express app
app.use(bodyParser.json()) // parses HTTP body

// postgres connection pool
const pool = new Pool({
    user: 'postgres',
    host: 'fydp-db-instance.c7ceo8ome79i.us-east-2.rds.amazonaws.com',
    database: 'initial_db',
    password: 'Angel516821!',
    port: 5432,
})

// insert object dectection data
app.post('api/detections', async(req, res) =>{
    const {timestamp, detections} = req.body;

    if(!timestamp){
        return res.status(400).json({error: 'Timestamp is missing'});
    }

    try{
        const result = await pool.query(
            'INSERT INTO object_dectection (timestamp, detections) VALUES ($1, $2), RETURNING *',
            [timestamp,detections]
        );

        res.status(201).json(result.rows[0]);
    }catch ( error){
        console.error('Error inserting detection data', error);
        res.status(500).json({error:'Internal Service Error'})
    }
});

app.get('/api/detections', async (req, res) => {
    const { start, end, label, classId, minConfidence } = req.query;

    let query = 'SELECT * FROM object_detection WHERE 1=1';
    const queryParams = [];

    if (start) {
        queryParams.push(start);
        query += ` AND timestamp >= $${queryParams.length}`;
    } 

    if (end) {
        queryParams.push(end);
        query += ` AND timestamp <= $${queryParams.length}`;
    }

    if (label) {
        queryParams.push(label);
        query += ` AND detections @> $${queryParams.length}::jsonb`;
    }

    if (classId) {
        queryParams.push(classId);
        query += ` AND detections @> $${queryParams.length}::jsonb`;
    }

    if (minConfidence) {
        queryParams.push(minConfidence);
        query += ` AND detections @> $${queryParams.length}::jsonb`;
    }

    try {
        // Modify the way JSONB parameters are passed for JSONB containment operations
        const formattedQueryParams = queryParams.map(param => {
            if (typeof param === 'string') {
                return JSON.stringify([{ label: param }]);
            } else if (typeof param === 'number') {
                return JSON.stringify([{ class: param }]);
            } else if (typeof param === 'number' && parseFloat(param)) {
                return JSON.stringify([{ confidence: { $gte: parseFloat(param) } }]);
            }
            return param;
        });

        const result = await pool.query(query, formattedQueryParams);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching detection data', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3001;
// listen for connection requests
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})