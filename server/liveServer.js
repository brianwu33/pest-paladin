const express = require("express");
const WebSocket = require("ws");
const spawn = require("child_process").spawn

const app = express();
const port = 5000;


// spawn ffmpeg process
const ffmpeg = spawn("ffmpeg", ["-f", "v4l2", "-i", "/dev/video0", "-vf", "scale=640:480", "-f", "mjpeg", "-"]);

const wss = new WebSocket.Server({ noServer: true});

wss.on("connection", (ws) => {
    console.log("Client connected to video stream");

    ffmpeg.stdout.on("data", (data) => ws.send(data));

    ws.on("close", () => console.log("Client disconnected"));
});

const server = app. listen(port, ()=> console.log(`Video Server on port ${port}`));

server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request,socket,head, (ws) => {
        wss.emit("connection", ws,request);
    })
});