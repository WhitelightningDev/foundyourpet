import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="container">
      <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
        <p className="col-md-4 mb-0 text-body-secondary">&copy; 2025 Found Your Pet</p>
        

        <Link
          to="/"
          className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
        >
          {/* Replace this with an actual logo or remove if not needed */}
          <img className="rounded" src="/android-chrome-192x192.png" alt="Logo" width="50" height="50" />
        </Link>

        <ul className="nav col-md-4 justify-content-end">
          <li className="nav-item">
            <Link to="/" className="nav-link px-2 text-body-secondary">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/features" className="nav-link px-2 text-body-secondary">
              Features
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/pricing" className="nav-link px-2 text-body-secondary">
              Pricing
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/faqs" className="nav-link px-2 text-body-secondary">
              FAQs
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link px-2 text-body-secondary">
              About
            </Link>
          </li>
        </ul>
      </footer>
    </div>
  );
}

export default Footer;
