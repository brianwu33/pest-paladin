import React from 'react';
import TopNavBar from '../components/TopNavBar';
import Button from "@material-ui/core/Button"
import Peer from "simple-peer"
import io from "socket.io-client"

const socket = io.connect("http://localhost:3001") // route to backend

const LiveFeedPage = () => {
    const [callAccepted, setCallAccepted] = useState(false);
    const userVideo = userRef();
    const connectionRef = useRef();

    useEffect(()=>{
        socket.on("offer", (data) =>{
            const peer = new Peer({
                initiator: false,
                trickle: false,
                stream: null
            });

            peer.on("signal", (signal) =>{
                socket.emit("answer", {signal, target: data.from});
            });

            peer.on("stream", (stream) =>{
                userVideo.current.srcObject = stream;
                setCallAccepted(true);
            });

            peer.signal(data.signal);
            connectionRef.current = peer;
        });

        return () =>{
            socket.off("offer");
        };
    }, [])
    
 
    return (
        <div>
        <div className="video-container">
          {callAccepted && <video ref={userVideo} autoPlay playsInline />}
        </div>
      </div>
    );
};

export default LiveFeedPage;
