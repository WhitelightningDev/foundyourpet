import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container } from "react-bootstrap";
import logo from "../assets/android-chrome-192x192.png";

function NavigationBar() {
  const [expanded, setExpanded] = useState(false); // Track navbar state

  // Function to close navbar after clicking a link
  const closeNavbar = () => setExpanded(false);

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="md"
      sticky="top"
      expanded={expanded} // Bind state
      onToggle={setExpanded} // Control toggle button
      className="shadow-lg py-3"
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
        <Navbar.Toggle aria-controls="navbar-nav" />

        {/* Navigation Links */}
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" onClick={closeNavbar}>Home</Nav.Link>
            <Nav.Link as={Link} to="/about" onClick={closeNavbar}>About</Nav.Link>
            <Nav.Link as={Link} to="/features" onClick={closeNavbar}>Features</Nav.Link>
            <Nav.Link as={Link} to="/contact" onClick={closeNavbar}>Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
