// web socket communication
const express = require("express");
const app = express();
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

const PORT = 3001;
// listen for connection requests
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});