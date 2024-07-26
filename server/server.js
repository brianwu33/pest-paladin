require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const {Pool} = require('pg');
const morgan = require("morgan");
const multer = require('multer');               // Used to handle file uploads
const sharp = require('sharp')                  // Used for image processing (cropping)
const cors = require('cors'); // Import the cors package

const app = express();                          // Create an instance of express app

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());                     // parses HTTP body
app.use(morgan('dev')); // logs HTTP request/response information

// postgres connection pool
const pool = new Pool({
    user: 'postgres',
    host: 'fydp-db-instance.c7ceo8ome79i.us-east-2.rds.amazonaws.com',
    database: 'initial_db',
    password: 'ece498group13',
    port: 5432,
    ssl: {
        rejectUnauthorized: false // Set to true if you want to reject unauthorized certificates
    }
});

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// basic route 
app.get('/', (req, res) => {
    res.send('Server is running');
});

// insert object dectection data
app.post('/api/detections', upload.single('image'), async (req, res) => {
    const { timestamp, userID, cameraID, Detections } = JSON.parse(req.body.data);
    const imageBuffer = req.file.buffer;

    if (!timestamp) {
        return res.status(400).json({ error: 'Timestamp is missing' });
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
            const result = await client.query(
                'SELECT * FROM detection_instance WHERE instance_id = $1',
                [instanceID]
            );

            if (result.rows.length > 0) {
                // Update existing instance
                await client.query(
                    `UPDATE detection_instance
                     SET timestamplist = array_append(timestamplist, $1)
                     WHERE instance_id = $2`,
                    [timestamp, instanceID]
                );
            } else {
                // Insert new instance
                await client.query(
                    `INSERT INTO detection_instance (instance_id, species, confidence, user_id, camera_id, camera_capture_image, species_capture_image, timestamplist)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                    [instanceID, species, confidence, userID, cameraID, imageBuffer, speciesCaptureImage, [timestamp]]
                );
            }
        }

        client.release();
        res.status(201).json({ message: 'Detections processed successfully' });

    } catch (error) {
        console.error('Error processing detections:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// app.post('/api/detections', async(req, res) =>{
//     const {timestamp, detections} = req.body;

//     if(!timestamp){
//         return res.status(400).json({error: 'Timestamp is missing'});
//     }

//     try{
//         const result = await pool.query(
//             'INSERT INTO object_detection_raw_data (timestamp, detections) VALUES ($1, $2) RETURNING *',
//             [timestamp,JSON.stringify(detections)]
//         );

//         res.status(201).json(result.rows[0]);
//     }catch ( error){
//         console.error('Error inserting detection data', error);
//         res.status(500).json({error:'Internal Service Error'})
//     }
// });

// fetch object detection data
// app.get('/api/detections', async (req, res) => {
//     const { start, end, label, classId, minConfidence } = req.query;

//     let query = 'SELECT * FROM object_detection WHERE 1=1';
//     const queryParams = [];

//     if (start) {
//         queryParams.push(start);
//         query += ` AND timestamp >= $${queryParams.length}`;
//     } 

//     if (end) {
//         queryParams.push(end);
//         query += ` AND timestamp <= $${queryParams.length}`;
//     }

//     if (label) {
//         queryParams.push(label);
//         query += ` AND detections @> $${queryParams.length}::jsonb`;
//     }

//     if (classId) {
//         queryParams.push(classId);
//         query += ` AND detections @> $${queryParams.length}::jsonb`;
//     }

//     if (minConfidence) {
//         queryParams.push(minConfidence);
//         query += ` AND detections @> $${queryParams.length}::jsonb`;
//     }

// if(user){
//     queryParams.push(user);
//     query += ` AND detections @> $${queryParams.length}::jsonb`;
// }

// if(camera){
//     queryParams.push(camera);
//     query += ` AND detections @> $${queryParams.length}::jsonb`;
// }

//     try {
//         // Modify the way JSONB parameters are passed for JSONB containment operations
//         const formattedQueryParams = queryParams.map(param => {
//             if (typeof param === 'string') {
//                 return JSON.stringify([{ label: param }]);
//             } else if (typeof param === 'number') {
//                 return JSON.stringify([{ class: param }]);
//             } else if (typeof param === 'number' && parseFloat(param)) {
//                 return JSON.stringify([{ confidence: { $gte: parseFloat(param) } }]);
//             }
//             return param;
//         });

//         const result = await pool.query(query, formattedQueryParams);
//         res.status(200).json(result.rows);
//     } catch (error) {
//         console.error('Error fetching detection data', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

app.get('/api/detections', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM detection_instance');
        client.release();
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error retrieving detection data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET endpoint to return the smallest missing instance_id
app.get('/api/detections/smallest-missing-id', async (req, res) => {
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

// GET endpoint to retrieve data based on instance_id
app.get('/api/detections/:id', async (req, res) => {
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

// DELETE endpoint to delete data based on instance_id
app.delete('/api/detections/:id', async (req, res) => {
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


// web socket communication
const http = require("http"); // create an http server
const server = http.createServer(app); // use the express instance
const socket = require("socket.io"); // websocket for real-time communication
const io = socket(server,{
    cors:{
        origin:"http://localhost:3000", // where is the frontend going to be running on
        methods: ["GET", "POST"] // only allows get and post
    }
});

io.on("connection", (socket) =>{ // listen for new connections, create new socket instance
    console.log("Client connected: ", socket.id);
    // connect via socket.id
    socket.on("offer", (payload) =>{
        io.to(payload.target).emit("offer", payload);
    });

    socket.on("answer", (payload) => {
        io.to(payload.target).emit("answer", payload);
    });
    socket.on("ice-candidate", (incoming) =>{
        io.to(incoming.target).emit("ice-candidate", incoming);
    });

    socket.on("disconnect", ()=>{
        console.log("Client disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 3001;
// listen for connection requests
app.listen(PORT,'0.0.0.0', () => {
    console.log(`Server listening on ${PORT}`);
});

// real sense processing
/*const server = http.createServer(app);
const wss = new WebSocket.Server({server});

app.use(express.json());
wss.on('connection', ws =>{
    console.log('New client connected');

    ws.on('message', message =>{
        console.log('Received message:',message);
    });

    ws.on('close', ()=>{
        console.log('Client disconnected');
    });

    ws.on('error', error=>{
        console.error('WebSocket error:', error);
    });
})*/