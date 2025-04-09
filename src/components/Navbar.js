import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext"; // ADD this line
import logo from "../assets/android-chrome-192x192.png";

function NavigationBar() {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useContext(AuthContext); // USE context here

  const closeNavbar = () => setExpanded(false);

  const handleLogout = () => {
    logout(); // Use context logout
    navigate("/"); 
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="md"
      sticky="top"
      expanded={expanded}
      onToggle={() => setExpanded((prev) => !prev)}
      className="shadow-lg py-3"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center" onClick={closeNavbar}>
          <img src={logo} alt="Found Your Pet Logo" width="40" height="40" className="me-2 rounded" />
          Found Your Pet
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" onClick={closeNavbar}>Home</Nav.Link>
            <Nav.Link as={Link} to="/about" onClick={closeNavbar}>About</Nav.Link>
            <Nav.Link as={Link} to="/features" onClick={closeNavbar}>Features</Nav.Link>
            <Nav.Link as={Link} to="/contact" onClick={closeNavbar}>Contact</Nav.Link>

            <div className="vr mx-3 d-none d-md-block text-white"></div>

            {!isLoggedIn ? (
              <>
                <Nav.Link as={Link} to="/login" onClick={closeNavbar}>Login</Nav.Link>
                <Nav.Link as={Link} to="/signup" onClick={closeNavbar}>Sign Up</Nav.Link>
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
