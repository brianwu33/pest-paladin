import React from 'react';

const DataTable = () =>{
    return (
        <div className="data-table-container">
        <table className="data-table">
            <thead>
                <tr>
                    <th>Pest Identification</th>
                    <th>Distance</th>
                    <th>X Maximum</th>
                    <th>X Minimum</th>
                    <th>Y Maximum</th>
                    <th>Y Minimum</th>
                    <th>Confidence</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Sample Rat</td>
                    <td>Sample Distance</td>
                    <td>Sample X Max</td>
                    <td>Sample X Min</td>
                    <td>Sample Y Max</td>
                    <td>Sample Y Min</td>
                    <td>Sample Confidence</td>
                </tr>
            </tbody>
        </table>
        </div>
    )
}

export default DataTable;