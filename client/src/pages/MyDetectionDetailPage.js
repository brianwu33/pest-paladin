import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import { Buffer } from 'buffer';

const MyDetectionDetailPage = () => {
    const location = useLocation();
    const { id } = useParams();
    const { detection } = location.state;

    const cameraCaptureImageBase64 = Buffer.from(detection.camera_capture_image.data).toString('base64');
    const speciesCaptureImageBase64 = Buffer.from(detection.species_capture_image.data).toString('base64');

    const imageStyle = {
        width: '200px', // Set the desired width
        height: 'auto', // Set the desired height
        objectFit: 'cover', // Ensure the image covers the dimensions without distortion
        border: '1px solid #ddd', // Optional: Add a border for better visibility
        borderRadius: '4px', // Optional: Add rounded corners
        margin: '10px' // Optional: Add some margin
    };

    return (
        <div>
            <TopNavBar />
            <h1>Detection Detail</h1>
            <p><strong>Instance ID:</strong> {detection.instance_id}</p>
            <p><strong>Species:</strong> {detection.species}</p>
            <p><strong>Camera ID:</strong> {detection.camera_id}</p>
            <p><strong>User ID:</strong> {detection.user_id}</p>
            <p><strong>Confidence:</strong> {detection.confidence}</p>
            <p><strong>Timestamp List:</strong></p>
            <ul>
                {detection.timestamplist.map((timestamp, index) => (
                    <li key={index}>{new Date(timestamp).toLocaleString()}</li>
                ))}
            </ul>
            <p><strong>Camera Capture Image:</strong></p>
            <img src={`data:image/jpeg;base64,${cameraCaptureImageBase64}`} alt="Camera Capture" style={imageStyle}/>
            <p><strong>Species Capture Image:</strong></p>
            <img src={`data:image/jpeg;base64,${speciesCaptureImageBase64}`} alt="Species Capture" style={imageStyle}/>
            </div>
    );
};

export default MyDetectionDetailPage;