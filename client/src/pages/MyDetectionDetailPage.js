import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import { Buffer } from 'buffer';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';

const MyDetectionDetailPage = () => {
    const location = useLocation();
    const { id } = useParams();
    const { detection } = location.state;

    const cameraCaptureImageBase64 = Buffer.from(detection.camera_capture_image.data).toString('base64');
    const speciesCaptureImageBase64 = Buffer.from(detection.species_capture_image.data).toString('base64');

    const duration = (new Date(detection.timestamplist[detection.timestamplist.length - 1]) - new Date(detection.timestamplist[0])) / 1000;

    const imageStyle = {
        height: '300px', // Set the desired height
        width: 'auto', // Maintain aspect ratio
        objectFit: 'contain', // Ensure the image fits within the dimensions
        border: '1px solid #ddd', // Optional: Add a border for better visibility
        borderRadius: '4px', // Optional: Add rounded corners
        margin: '10px' // Optional: Add some margin
    };

    return (
        <div>
            <TopNavBar />
            <Container className="mt-4">
                <h1 className="mb-4">Detection Detail</h1>
                {detection ? (
                    <Card className="shadow-sm">
                        <Card.Header as="h5">Detection Details</Card.Header>
                        <Card.Body>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Card.Img variant="top" src={`data:image/jpeg;base64,${cameraCaptureImageBase64}`} alt="Camera Capture" style={imageStyle} className="img-fluid rounded" />
                                </Col>
                                <Col md={6}>
                                    <Card.Img variant="top" src={`data:image/jpeg;base64,${speciesCaptureImageBase64}`} alt="Species Capture" style={imageStyle} className="img-fluid rounded" />
                                </Col>
                            </Row>
                            <ListGroup variant="flush">
                                <ListGroup.Item><strong>Instance ID:</strong> {detection.instance_id}</ListGroup.Item>
                                <ListGroup.Item><strong>Species:</strong> {detection.species}</ListGroup.Item>
                                <ListGroup.Item><strong>Camera ID:</strong> {detection.camera_id}</ListGroup.Item>
                                <ListGroup.Item><strong>User ID:</strong> {detection.user_id}</ListGroup.Item>
                                <ListGroup.Item><strong>Confidence:</strong> {detection.confidence}</ListGroup.Item>
                                <ListGroup.Item><strong>Duration:</strong> {duration.toFixed(2)} seconds</ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                ) : (
                    <div>Loading...</div>
                )}
            </Container>
        </div>
    );
};

export default MyDetectionDetailPage;
