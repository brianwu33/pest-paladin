import React, {useState} from 'react'
import TopNavBar from './TopNavBar'
import Slideshow from './Slideshow'
import {Alert, Button, Card, Container, Row, Col} from 'react-bootstrap'

import './style.css'

import ratEating from './images/rat_eating.jpg';
import liveFeed from './images/live_feed.jpg';
import analytics from './images/analytics.jpg';

const Home = () =>{
    /*<Alert variant="primary">Hello, Pest Paladin at your service!</Alert>*/
    /*const sImages = [{home}, {tracking}, {pest}]
    const sCaptions = [ "Welcome" , "Tracking", "Identification"]
    const sDescriptions = ["Explore the features of Pest Paladin", "Real-time and predictive tracking of pests", "Accurate pest identification"]*/
    return (
        <div>
            <TopNavBar/>
            <Slideshow />
            <li></li>
            <li></li>
            <Container>
                <Row>
                    <Col md={4}>
                        <Card className="card-content p-0 rounded" style ={{ height: '400px'}}>
                        <div className = "card-img-cover rounded">
                            <img src={ratEating} alt="Rat-Eating"/>
                        </div>
                            <div className="card-overlay">
                                <Card.Title style = {{color:'white'}}>
                                    My Recordings
                                </Card.Title>
                                <Card.Text style = {{color:'orange'}}>
                                    Review your pest trackings
                                </Card.Text>

                            </div>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="card-content p-0 rounded" style ={{ height: '400px'}}>
                        <div className = "card-img-cover rounded">
                            <img src={liveFeed} alt="Rat-Eating"/>
                        </div>
                            <div className="card-overlay">
                                <Card.Title style = {{color:'white'}}>
                                        My Analytics
                                </Card.Title>
                                <Card.Text style = {{color:'orange'}}>
                                        Explore your pest tracking analystics
                                </Card.Text>

                            </div>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="card-content p-0 rounded" style ={{ height: '400px'}}>
                            <div className = "card-img-cover rounded">
                                <img src={analytics} alt="Rat-Eating"/>
                            </div>
                            <div className="card-overlay">
                                <Card.Title style = {{color:'white'}}>
                                        Live Feed
                                </Card.Title>
                                <Card.Text style = {{color:'orange'}}>
                                        Take a look at your real-time live feed
                                </Card.Text>

                            </div>
                        </Card>

                    </Col>
                </Row>
            </Container>
            <li></li>
            <li></li>
        </div>
    )
}

export default Home