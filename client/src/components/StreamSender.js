import React, { useEffect, useRef } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";

const StreamSender = () => {
    const videoRef = useRef(null);
    const socket = useRef(null);
    let peer;

    useEffect(() => {
        socket.current = io("http://localhost:2000"); // Connect to WebSocket server

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream; // Display local video
            }

            peer = new Peer({
                initiator: true,
                trickle: false,
                stream: stream
            });

            peer.on("signal", (data) => {
                socket.current.emit("getReceivers", {}, (receivers) => {
                    const receiverSocketId = Object.keys(receivers)[0]; // Pick first available receiver

                    if (receiverSocketId) {
                        socket.current.emit("offer", {
                            target: receiverSocketId,
                            signal: data
                        });
                    } else {
                        console.log("No receivers available.");
                    }
                });
            });

            peer.on("connect", () => {
                console.log("Peer connection established.");
            });

            socket.current.on("answer", (data) => {
                peer.signal(data.signal);
            });

            peer.on("stream", (stream) => {
                console.log("Stream received.");
            });

            peer.on("close", () => {
                console.log("Connection closed.");
            });

            peer.on("error", (err) => {
                console.error("Error:", err);
            });
        });

        return () => {
            socket.current.disconnect();
        };
    }, []);

    return <video ref={videoRef} autoPlay playsInline />;
};

export default StreamSender;
