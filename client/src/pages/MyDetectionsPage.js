import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';

const MyDetectionsPage = () => {
    const [detections, setDetections] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetections = async () => {
            try {
                // const response = await axios.get('http://localhost:4000/api/detections');
                // setDetections(response.data);
                const response = await fetch('/temp2.json');
                const data = await response.json();
                console.log(data)
                setDetections(data);
            } catch (error) {
                console.error('Error fetching detections:', error);
            }
        };

        fetchDetections();
    }, []);

    const handleViewClick = (detection) => {
        navigate(`/my-detection/${detection.instance_id}`, { state: { detection } });
    };

    return (
        <div>
            <TopNavBar />
            <h1>Detection List</h1>
            <table>
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>Species</th>
                        <th>Camera ID</th>
                        <th>Duration</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {detections.map((detection) => (
                        <tr key={detection.instance_id}>
                            <td>{new Date(detection.timestamplist[0]).toLocaleString()}</td>
                            <td>{detection.species}</td>
                            <td>{detection.camera_id}</td>
                            <td>
                                {((new Date(detection.timestamplist[detection.timestamplist.length - 1]) - new Date(detection.timestamplist[0])) / 1000).toFixed(2)} seconds
                            </td>
                            <td>
                                <button onClick={() => handleViewClick(detection)}>View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyDetectionsPage;