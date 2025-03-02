import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container } from "react-bootstrap";
import logo from "../assets/android-chrome-192x192.png";

function NavigationBar() {
  const [expanded, setExpanded] = useState(false); // Track navbar state
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const navigate = useNavigate();

  // Function to close navbar after clicking a link
  const closeNavbar = () => setExpanded(false);

  // Check if the user is logged in by checking localStorage
  useEffect(() => {
    const token = localStorage.getItem("authToken"); // Check token in localStorage
    setIsLoggedIn(!!token); // Update state based on token presence
  }, []); // Empty dependency array to check only on component mount

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove the token from localStorage
    setIsLoggedIn(false); // Update state to reflect logout
    navigate("/"); // Redirect to home page (or any page you prefer)
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="md"
      sticky="top"
      expanded={expanded}
      onToggle={() => setExpanded((prev) => !prev)} // Toggle navbar
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
            
            {/* Separator for better spacing */}
            <div className="vr mx-3 d-none d-md-block text-white"></div>

            {/* Conditionally render Login, Signup, or Logout based on login state */}
            {!isLoggedIn ? (
              <>
                <Nav.Link as={Link} to="/login" className="text-light" onClick={closeNavbar}>
                  <i className="bi bi-box-arrow-in-right me-1"></i> Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup" className="text-light" onClick={closeNavbar}>
                  <i className="bi bi-person-plus me-1"></i> Sign Up
                </Nav.Link>
              </>
            ) : (
              <Nav.Link as="button" className="text-light" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-1"></i> Logout
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
