import React from 'react';

const DataTable = ({ detections, handleViewClick }) => {
    if (!detections || detections.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="data-table-container">
            <table className="data-table">
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

export default DataTable;
