import React from 'react';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const DataTable = ({ detections, handleViewClick }) => {
    if (!detections || detections.length === 0) {
        return <div>Loading...</div>;
    }

    const handleDeleteClick = (detection) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this detection?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteDetection(detection.instance_id)
                },
                {
                    label: 'No'
                }
            ]
        });
    };

    const deleteDetection = async (instance_id) => {
        try {
            await axios.delete(`http://localhost:4000/api/detections/${instance_id}`);
            window.location.reload(); // Reload the page after deletion
        } catch (error) {
            console.error('Error deleting detection:', error);
        }
    };

    return (
        <div className="data-table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>Species</th>
                        <th>Camera ID</th>
                        <th>Duration</th>
                        <th>Details</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {detections.map((detection) => (
                        <tr key={detection.instance_id}>
                            <td>{new Date(detection.timestamplist[0]).toLocaleString()}</td>
                            <td>{detection.species}</td>
                            <td>{detection.camera_id}</td>
                            <td>
                                {Math.round((new Date(detection.timestamplist[detection.timestamplist.length - 1]) - new Date(detection.timestamplist[0])) / 1000)} seconds
                            </td>
                            <td>
                                <button onClick={() => handleViewClick(detection)}>View</button>
                            </td>
                            <td>
                                <button onClick={() => handleDeleteClick(detection)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
