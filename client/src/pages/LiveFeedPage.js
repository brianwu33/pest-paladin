import React, { useState, useEffect, useRef } from 'react';
import TopNavBar from '../components/TopNavBar';
import Peer from "simple-peer"
import io from "socket.io-client"

const socket = io.connect("http://localhost:5000") // route to backend

const LiveFeedPage = () => {
    const [isStreaming, setIsStreaming] = useState("false")
    const videoRef = useRef(null);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:5000"); // create WebSocket object, ws for local connectoin
        ws.onmessage = (event) =>{
            const blob = new Blob([event.data], {type: "image/jpeg"});
            videoRef.current.src = URL.createObjectURL(blob);
        };

        return () => ws.close();
    }, [isStreaming]) // run only when isStreaming Changes

    const toggleStreaming = () =>{
        isStreaming.setIsStreaming(!isStreaming);
    }

    return (
        <div>
        <TopNavBar>
            <div className="video-container">
                {isStreaming ? (<button onClick={toggleStreaming}> Join the Livestream! </button>) :
                    (videoRef.current  && <img ref={videoRef} alt="Live Stream"/>)
                 }
            </div>
        </TopNavBar>
      </div>
    );
};

export default LiveFeedPage;
