import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Navbar } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';

const TopNavBar = () =>{
    const navigate = useNavigate();

    const handleNavBarClick = (path) => {
        navigate(path);
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
            <Navbar.Brand onClick={() => handleNavBarClick('/')} style={{ cursor: 'pointer' }}>
                    Pest-Paladin
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
                <FaUserCircle 
                    size={30} 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => handleNavBarClick('/profile')} 
                />
            </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default TopNavBar