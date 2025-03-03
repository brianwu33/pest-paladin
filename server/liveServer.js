const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

let clients = {}; // Store connected users

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    clients[socket.id] = socket;

    // Listen for binary frame data from the RealSense camera
    socket.on("frame", (data) => {
        // Broadcast the binary frame to all clients
        io.emit("frame", Buffer.from(data).toString("base64")); // Convert to Base64 for frontend
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        delete clients[socket.id];
    });
});

server.listen(2000, () => console.log("Streaming server running on port 2000"));
