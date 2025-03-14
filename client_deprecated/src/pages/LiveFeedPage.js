import React, { useState, useEffect, useRef } from 'react';
import TopNavBar from '../components/old/TopNavBar';
import io from "socket.io-client"

const LiveFeedPage = () => {
    const [isStreaming, setIsStreaming] = useState(false);
    const videoRef = useRef(null);
    const socket = useRef(null);

    useEffect(() => {
        // Initialize socket.io connection once
        socket.current = io('http://localhost:2000');

        return () => {
            socket.current.disconnect();
        };
    }, []); // Only runs once when the component mounts

    useEffect(() => {
        if (isStreaming) {
            socket.current.on('stream', (data) => {
                if (videoRef.current) {
                    const blob = new Blob([data], { type: 'video/webm' }); // Convert received stream data to a video blob
                    videoRef.current.src = URL.createObjectURL(blob);
                }
            });
        }
    }, [isStreaming]); // Run this effect only when isStreaming changes

    const toggleStreaming = () =>{
        setIsStreaming(prev => !prev);
    }

    return (
    <div>
        <TopNavBar />
        
        {!isStreaming ? (<button onClick={toggleStreaming} style={{ display: 'block', background: 'red', color: 'white'}}> Join the Livestream! </button>) :
                    <video ref={videoRef} autoPlay playsInline/> 
        }
      </div>
    );
};

export default LiveFeedPage;
