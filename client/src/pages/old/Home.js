// Deprecated

import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../../components/old/TopNavBar';
import Slideshow from '../../components/old/Slideshow';
import { Card, Container, Row, Col } from 'react-bootstrap';

const Home = () => {
    const navigate = useNavigate();

    const handleCardClick = (path) => {
        navigate(path);
    };

    return (
        <div>
            <TopNavBar />
            <Slideshow />
            <br/>
            <br/>
            <Container>
                <Row>
                    <Col md={4}>
                        <Card 
                            className="card-content p-0 rounded card-hover" 
                            style={{ height: '400px', cursor: 'pointer' }} 
                            onClick={() => handleCardClick('/my-detections')}
                        >
                            <div className="card-img-cover rounded">
                                <img src="/images/rat_eating.jpg" alt="Rat-Eating" />
                            </div>
                            <div className="card-overlay">
                                <Card.Title style={{ color: 'white' }}>
                                    My Detections
                                </Card.Title>
                                <Card.Text style={{ color: 'orange' }}>
                                    Review your pest trackings
                                </Card.Text>
                            </div>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card 
                            className="card-content p-0 rounded card-hover" 
                            style={{ height: '400px', cursor: 'pointer' }} 
                            onClick={() => handleCardClick('/my-analytics')}
                        >
                            <div className="card-img-cover rounded">
                                <img src="/images/live_feed.jpg" alt="Live Feed" />
                            </div>
                            <div className="card-overlay">
                                <Card.Title style={{ color: 'white' }}>
                                    My Analytics
                                </Card.Title>
                                <Card.Text style={{ color: 'orange' }}>
                                    Explore your pest tracking analytics
                                </Card.Text>
                            </div>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card 
                            className="card-content p-0 rounded card-hover" 
                            style={{ height: '400px', cursor: 'pointer' }} 
                            onClick={() => handleCardClick('/live-feed')}
                        >
                            <div className="card-img-cover rounded">
                                <img src="/images/analytics.jpg" alt="Analytics" />
                            </div>
                            <div className="card-overlay">
                                <Card.Title style={{ color: 'white' }}>
                                    Live Feed
                                </Card.Title>
                                <Card.Text style={{ color: 'orange' }}>
                                    Take a look at your real-time live feed
                                </Card.Text>
                            </div>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card 
                            className="card-content p-0 rounded card-hover" 
                            style={{ height: '400px', cursor: 'pointer' }} 
                            onClick={() => handleCardClick('/sender')}
                        >
                            <div className="card-img-cover rounded">
                                <img src="/images/analytics.jpg" alt="Temporary Streaming" />
                            </div>
                            <div className="card-overlay">
                                <Card.Title style={{ color: 'white' }}>
                                    Streaming
                                </Card.Title>
                                <Card.Text style={{ color: 'orange' }}>
                                    Take a look at your real-time live feed
                                </Card.Text>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Home;
