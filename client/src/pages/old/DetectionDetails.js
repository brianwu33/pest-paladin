// Deprecated

import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import { Buffer } from 'buffer';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import '../MyDetectionsPage.css'; // Adjust the path as needed


const DetectionDetails = () => {
    const location = useLocation();
    const { id } = useParams();
    const { detection } = location.state;

    const cameraCaptureImageBase64 = Buffer.from(detection.camera_capture_image.data).toString('base64');
    const speciesCaptureImageBase64 = Buffer.from(detection.species_capture_image.data).toString('base64');

    const duration = Math.round((new Date(detection.timestamplist[detection.timestamplist.length - 1]) - new Date(detection.timestamplist[0])) / 1000)

    return (
        <div>
            <TopNavBar />
            <div className="detection-page">
                <h1 className="mb-4 detection-heading">Detection Detail</h1>
                <Container className="mt-4 detection-detail-content">
                    {detection ? (
                        <Card className="shadow-sm">
                            <Card.Header as="h5">Detection Details</Card.Header>
                            <Card.Body>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Card.Img variant="top" src={`data:image/jpeg;base64,${cameraCaptureImageBase64}`} alt="Camera Capture" className="img-fluid rounded detection-image" />
                                    </Col>
                                    <Col md={6}>
                                        <Card.Img variant="top" src={`data:image/jpeg;base64,${speciesCaptureImageBase64}`} alt="Species Capture" className="img-fluid rounded detection-image" />
                                    </Col>
                                </Row>
                                <ListGroup variant="flush">
                                    <ListGroup.Item><strong>Instance ID:</strong> {detection.instance_id}</ListGroup.Item>
                                    <ListGroup.Item><strong>Species:</strong> {detection.species}</ListGroup.Item>
                                    <ListGroup.Item><strong>Camera ID:</strong> {detection.camera_id}</ListGroup.Item>
                                    <ListGroup.Item><strong>User ID:</strong> {detection.user_id}</ListGroup.Item>
                                    <ListGroup.Item><strong>Confidence:</strong> {detection.confidence}</ListGroup.Item>
                                    <ListGroup.Item><strong>Duration:</strong> {duration} seconds</ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    ) : (
                        <div>Loading...</div>
                    )}
                </Container>
            </div>
        </div>
    );
};

export default DetectionDetails;
