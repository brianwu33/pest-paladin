import React from 'react';
import { Carousel } from 'react-bootstrap';

import home from '../assets/images/garden.jpg';
import smallMouse from '../assets/images/small_mouse.jpg';
import tracking from '../assets/images/tracking.jpg';

const Slideshow = () => {
    return (
        <Carousel>
                <Carousel.Item>
                    <img
                        src = {home}
                        alt = {`Slide 1`}
                        className = "d-block w-100"
                        style={{ height: '400px', objectFit: 'cover' }} 
                    />
                    <Carousel.Caption className="caption-overlay">
                        <h2>Welcome</h2>
                        <p style = {{color:'orange'}}>Explore the features of Pest Paladin</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        src = {tracking}
                        alt = {`Slide 2`}
                        className = "d-block w-100"
                        style={{ height: '400px', objectFit: 'cover' }} 
                    />
                    <Carousel.Caption className="caption-overlay">
                        <h2>Tracking</h2>
                        <p style = {{color:'orange'}}>Real-time and predictive tracking of pests</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        src = {smallMouse}
                        alt = {`Slide 3`}
                        className = "d-block w-100"
                        style={{ height: '400px', objectFit: 'cover' }} 
                    />
                    <Carousel.Caption className="caption-overlay">
                        <h2>Identification</h2>
                        <p style = {{color:'orange'}}>Accurate pest identification</p>
                    </Carousel.Caption>
                </Carousel.Item>
        </Carousel>
    )
}

export default Slideshow