import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import Typing from 'react-typing-effect';
import TypingEffect from '../components/TypingEffect';

const Slideshow = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setActiveIndex(selectedIndex);
    };

    return (
        <Carousel activeIndex={activeIndex} onSelect={handleSelect}>
                <Carousel.Item>
                    <img
                        src = "/images/garden.jpg"
                        alt = {`Slide 1`}
                        className = "d-block w-100"
                        style={{ height: '400px', objectFit: 'cover' }} 
                    />
                    <Carousel.Caption className="caption-overlay">
                        <TypingEffect text="Welcome to Pest Paladin" speed={100} reset={activeIndex === 0} />
                        <p style = {{color:'orange'}}>Explore the features of Pest Paladin</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        src = "/images/tracking.jpg"
                        alt = {`Slide 2`}
                        className = "d-block w-100"
                        style={{ height: '400px', objectFit: 'cover' }} 
                    />
                    <Carousel.Caption className="caption-overlay">
                        <TypingEffect text="Path Tracking" speed={100} reset={activeIndex === 1} />
                        <p style = {{color:'orange'}}>Real-time and predictive tracking of pests</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        src = "/images/small_mouse.jpg"
                        alt = {`Slide 3`}
                        className = "d-block w-100"
                        style={{ height: '400px', objectFit: 'cover' }} 
                    />
                    <Carousel.Caption className="caption-overlay">
                        <TypingEffect text="Species Identification" speed={100} reset={activeIndex === 2} />
                        <p style = {{color:'orange'}}>Accurate pest identification</p>
                    </Carousel.Caption>
                </Carousel.Item>
        </Carousel>
    )
}

export default Slideshow