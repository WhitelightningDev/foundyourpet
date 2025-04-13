import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

function Prices() {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <img
          className="d-block mx-auto mb-3 rounded"
          src="/android-chrome-192x192.png"
          alt="logo"
          width="80"
          height="80"
        />
        <h1 className="display-5 text-body-emphasis">Standard Package Pricing</h1>
        <p className="lead text-muted">
          Everything you need to keep your pet safe and easily identifiable.
        </p>
      </div>

      <div className="row g-5 align-items-center">
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h2 className="fw-bold text-primary">R120 Once-Off</h2>
              <ul className="list-unstyled mt-3 mb-4">
                <li>✔ 30mm Nickel-Plated Pet Tag</li>
                <li>✔ Unique QR Code</li>
                <li>✔ Custom Engraving</li>
                <li>✔ Doorstep or PUDO Delivery</li>
              </ul>
              <h2 className="fw-bold text-success mt-4 mb-2">R70 / month</h2>
              <ul className="list-unstyled">
                <li>✔ Ongoing Support</li>
                <li>✔ Free Tag Replacement</li>
                <li>✔ Access to upcoming features</li>
                <li>✔ Peace of Mind 24/7</li>
              </ul>
              <h5 className="text-center text-primary mt-3 m-2 border-bottom">Total for the standard package: R190</h5>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <h3 className="fw-semibold text-body-emphasis mb-3">Tag Features</h3>
          <p className="text-body-secondary">
            Our <strong>30mm Round Shape Nickel-Plated Tag</strong> is designed
            with durability and practicality in mind. It’s rust-proof, available
            in <strong>stainless steel</strong> or <strong>brass</strong>, and
            includes an “O” ring for easy attachment to your pet’s collar or harness.
          </p>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">✅ Will not rust or tarnish</li>
            <li className="list-group-item">✅ Easy to apply and lightweight</li>
            <li className="list-group-item">✅ Custom QR code links to your pet profile</li>
            <li className="list-group-item">✅ Stylish and practical</li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-5">
        {/* Link to the dynamic route */}
        <Link
          to={`/select-tag/standard`} // Passing the tagType as "standard"
          className="btn btn-lg btn-primary px-4 me-3"
        >
          Purchase Now
        </Link>
        <a href="/NormalLearn" className="btn btn-lg btn-outline-secondary px-4">
          Learn More
        </a>
      </div>
    </div>
  );
}

export default Prices;
