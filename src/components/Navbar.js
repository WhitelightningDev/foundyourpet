import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/android-chrome-192x192.png";

function NavigationBar() {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useContext(AuthContext);
  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (e) {
    console.error("Failed to parse user from localStorage:", e);
    user = null;
  }
  
  const isAdmin = user?.isAdmin; // Use actual role flag, not email check

  const closeNavbar = () => setExpanded(false);

  const handleLogout = () => {
    logout();
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
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold d-flex align-items-center"
          onClick={closeNavbar}
        >
          <img
            src={logo}
            alt="Found Your Pet Logo"
            width="40"
            height="40"
            className="me-2 rounded"
          />
          Found Your Pet
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" onClick={closeNavbar}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/prices" onClick={closeNavbar}>
              Prices
            </Nav.Link>
            <Nav.Link as={Link} to="/features" onClick={closeNavbar}>
              Features
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" onClick={closeNavbar}>
              Contact
            </Nav.Link>

            <div className="vr mx-3 d-none d-md-block text-white"></div>

            {/* Always show only ONE Dashboard link */}
            {isLoggedIn && (
              <Nav.Link
                as={Link}
                to={isAdmin ? "/admin-dashboard" : "/dashboard"}
                onClick={closeNavbar}
              >
                Dashboard
              </Nav.Link>
            )}

            {/* Profile icon */}
            {isLoggedIn && (
              <Nav.Link as={Link} to="/profile" onClick={closeNavbar}>
                <i className="bi bi-person-circle fs-5"></i>
              </Nav.Link>
            )}

            {/* Auth Links */}
            {!isLoggedIn ? (
              <>
                <Nav.Link as={Link} to="/login" onClick={closeNavbar}>
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup" onClick={closeNavbar}>
                  Sign Up
                </Nav.Link>
              </>
            ) : (
              <Nav.Link
                as="button"
                className="text-light"
                onClick={handleLogout}
              >
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
