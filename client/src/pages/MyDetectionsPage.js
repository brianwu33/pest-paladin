import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import DataTable from '../components/DataTable'; // Adjust the path as needed


const MyDetectionsPage = () => {
    const [detections, setDetections] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetections = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/detections');
                setDetections(response.data);
                // const response = await fetch('/temp2.json');
                // const data = await response.json();
                console.log(response.data)
                // setDetections(data);
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
            <DataTable detections={detections} handleViewClick={handleViewClick} />
        </div>
    );
};

export default MyDetectionsPage;