const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

let clients = {}; // Store connected users and their socket IDs

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Store new client
    clients[socket.id] = socket.id;

    // Listen for an offer from the sender
    socket.on("offer", (data) => {
        console.log(`Offer received from ${socket.id} to ${data.target}`);

        // Forward the offer to the receiver (target user)
        if (clients[data.target]) {
            io.to(data.target).emit("offer", {
                signal: data.signal,
                sender: socket.id  // Send sender's ID back to the receiver
            });
        }
    });

    // Listen for an answer from the receiver
    socket.on("answer", (data) => {
        console.log(`Answer received from ${socket.id} for ${data.sender}`);

        // Forward the answer to the sender
        if (clients[data.sender]) {
            io.to(data.sender).emit("answer", {
                signal: data.signal
            });
        }
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        delete clients[socket.id]; // Remove disconnected user
    });
});

server.listen(2000, () => console.log("Signaling server running on port 2000"));