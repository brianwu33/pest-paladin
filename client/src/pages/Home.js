import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import Slideshow from '../components/Slideshow';
import { Card, Container, Row, Col } from 'react-bootstrap';
import '../style.css';

import ratEating from '../assets/images/rat_eating.jpg';
import liveFeed from '../assets/images/live_feed.jpg';
import analytics from '../assets/images/analytics.jpg';

const Home = () => {
    const navigate = useNavigate();

    const handleCardClick = (path) => {
        navigate(path);
    };

    return (
        <div>
            <TopNavBar />
            <Slideshow />
            <li></li>
            <li></li>
            <Container>
                <Row>
                    <Col md={4}>
                        <Card 
                            className="card-content p-0 rounded card-hover" 
                            style={{ height: '400px', cursor: 'pointer' }} 
                            onClick={() => handleCardClick('/my-detections')}
                        >
                            <div className="card-img-cover rounded">
                                <img src={ratEating} alt="Rat-Eating" />
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
                                <img src={liveFeed} alt="Live Feed" />
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
                                <img src={analytics} alt="Analytics" />
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
                </Row>
            </Container>
        </div>
    );
};

export default Home;
