// sender.js
const Peer = require("simple-peer");
const io = require("socket.io-client");

const socket = io("http://localhost:4000"); // URL of the signaling server
let peer;

navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
  peer = new Peer({
    initiator: true,
    trickle: false,
    stream: stream
  });

  peer.on("signal", (data) => {
    socket.emit("offer", {
      target: 'RECEIVER_SOCKET_ID', // Replace with receiver's socket ID
      signal: data
    });
  });

  peer.on("connect", () => {
    console.log("Peer connection established.");
  });

  socket.on("answer", (data) => {
    peer.signal(data.signal);
  });

  peer.on("stream", (stream) => {
    // Handle incoming stream if needed
  });

  peer.on("close", () => {
    console.log("Connection closed.");
  });

  peer.on("error", (err) => {
    console.error("Error:", err);
  });
});
