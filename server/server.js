require("dotenv").config();

// setup code
const express = require("express");
const db = require("./db"); // it will automatically look for index.js
const morgan = require("morgan");
const app = express(); // create an instance of express app
const PORT = process.env.PORT || 3001;

// middlewares
app.use(morgan("tiny")); // shows the throughput and exact request sent
app.use((req,res, next) =>{ // can also as send a request back to the user
    console.log("Middleware is running");
    next(); // pass control to the next routehandler
}); // create a middleware to handle route handling

// HTTP Requests
app.get("/", (req,res) =>{
    res.send("Hello World!");
})

// Get all processed images
app.get("/api/v1/pro_images", async (req,res) => { // use async because querys take some time
    const results = await db.query("select * from images"); // test this when db tables are setup
    res.status(200).json({
        // dummy data
        status: "success",
        data: {
            pro_images: [
                "image1", 
                "image2", 
                "image3",]
        }
    })
});

// listen for connection requests
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})