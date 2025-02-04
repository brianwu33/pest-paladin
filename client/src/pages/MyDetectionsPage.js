import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import DataTable from '../components/DataTable'; // Adjust the path as needed
import '../MyDetectionsPage.css'; // Adjust the path as needed


const MyDetectionsPage = () => {
    const [detections, setDetections] = useState([]);
    const [isCalender, setCalenderOrList] = useState(true); // true for calendar view, false for list view
    const navigate = useNavigate();

    const toggleMode = () => {
        setCalenderOrList(!isCalender);
    }

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
            <div className="detection-page">
                <h1 className="mb-4 detection-heading">My Detections</h1>
                {detections.length > 0 && (
                    <div className="detection-content">
                        <DataTable detections={detections} handleViewClick={handleViewClick} />
                    </div>
                )};
            </div>
        </div>
    );
};

export default MyDetectionsPage;