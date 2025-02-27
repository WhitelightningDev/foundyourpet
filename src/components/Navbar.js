import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container } from "react-bootstrap"; // Import Bootstrap Components
import logo from "../assets/android-chrome-192x192.png";

function NavigationBar() {
  return (
    <Navbar bg="dark" variant="dark" expand="md" sticky="top" className="shadow-lg py-3">
      <Container>
        {/* Brand / Logo */}
        <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center">
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
            <Nav.Link as={Link} to="/" className="mx-2 text-uppercase fw-semibold">Home</Nav.Link>
            <Nav.Link as={Link} to="/about" className="mx-2 text-uppercase fw-semibold">About</Nav.Link>
            <Nav.Link as={Link} to="/features" className="mx-2 text-uppercase fw-semibold">Features</Nav.Link>
            <Nav.Link as={Link} to="/contact" className="mx-2 text-uppercase fw-semibold">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
