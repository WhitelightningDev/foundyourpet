import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container } from "react-bootstrap"; // Import Bootstrap Components
import logo from "../assets/android-chrome-192x192.png";

function NavigationBar() {
  const [expanded, setExpanded] = useState(false); // Track navbar state

  // Function to close the navbar
  const closeNavbar = () => setExpanded(false);

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="md"
      sticky="top"
      className="shadow-lg py-3"
      expanded={expanded} // Bind to state
      onToggle={(isExpanded) => setExpanded(isExpanded)} // Update state
    >
      <Container>
        {/* Brand / Logo */}
        <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center" onClick={closeNavbar}>
          <img
            src={logo}
            alt="Found Your Pet Logo"
            width="40"
            height="40"
            className="d-inline-block align-top me-2 rounded"
          />
          Found Your Pet
        </Navbar.Brand>

        {/* Toggle Button for Mobile */}
        <Navbar.Toggle aria-controls="navbar-nav" onClick={() => setExpanded(!expanded)} />

        {/* Navigation Links */}
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="mx-2 text-uppercase fw-semibold" onClick={closeNavbar}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className="mx-2 text-uppercase fw-semibold" onClick={closeNavbar}>
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/features" className="mx-2 text-uppercase fw-semibold" onClick={closeNavbar}>
              Features
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="mx-2 text-uppercase fw-semibold" onClick={closeNavbar}>
              Contact
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* Close Navbar on Click Outside */}
      {expanded && <div className="overlay" onClick={closeNavbar} style={overlayStyles}></div>}
    </Navbar>
  );
}

// Overlay to detect clicks outside the navbar
const overlayStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "transparent",
  zIndex: 998, // Behind the navbar
};

export default NavigationBar;
