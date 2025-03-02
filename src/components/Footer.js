import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="container-fluid mt-auto">
      <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 border-top">
        {/* Copyright Text */}
        <p className="col-lg-4 col-md-6 mb-0 text-center text-md-start text-body-secondary">
          &copy; 2025 Found Your Pet
        </p>

        {/* Logo in Center */}
        <Link
          to="/"
          className="col-lg-4 col-md-6 d-flex align-items-center justify-content-center mb-3 mb-md-0"
        >
          <img className="rounded" src="/android-chrome-192x192.png" alt="Logo" width="50" height="50" />
        </Link>

        {/* Navigation Links */}
        <ul className="nav col-lg-4 col-md-12 justify-content-center justify-content-lg-end">
          <li className="nav-item">
            <Link to="/" className="nav-link px-2 text-body-secondary">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/features" className="nav-link px-2 text-body-secondary">Features</Link>
          </li>
          <li className="nav-item">
            <Link to="/pricing" className="nav-link px-2 text-body-secondary">Pricing</Link>
          </li>
          <li className="nav-item">
            <Link to="/faqs" className="nav-link px-2 text-body-secondary">FAQs</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link px-2 text-body-secondary">About</Link>
          </li>
        </ul>
      </footer>
    </div>
  );
}

export default Footer;
