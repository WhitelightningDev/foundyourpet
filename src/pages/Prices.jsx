import React from "react";
import { Link } from "react-router-dom";

function Prices() {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <img
          src="/android-chrome-192x192.png"
          alt="logo"
          className="rounded mb-3"
          width="80"
          height="80"
        />
        <h1 className="display-4 fw-bold text-dark">Standard Package Pricing</h1>
        <p className="lead text-muted">
          Everything you need to keep your pet safe and easily identifiable.
        </p>
      </div>

      <div className="row g-5 align-items-start">
        {/* Pricing Card */}
        <div className="col-md-6">
          <div className="card border-0 shadow-lg h-100">
            <div className="card-body p-4">
              <h4 className="text-primary fw-bold mb-3">Once-Off Payment</h4>
              <h2 className="display-6 fw-bold text-dark">R120</h2>
              <ul className="list-unstyled my-4">
                <li>✔ 30mm Nickel-Plated Pet Tag</li>
                <li>✔ Unique QR Code</li>
                <li>✔ Custom Engraving</li>
                <li>✔ Doorstep or PUDO Delivery</li>
              </ul>

              <h4 className="text-success fw-bold mb-3">Monthly Subscription</h4>
              <h2 className="display-6 fw-bold text-dark">R70 / month</h2>
              <ul className="list-unstyled my-4">
                <li>✔ Ongoing Support</li>
                <li>✔ Free Tag Replacement</li>
                <li>✔ Access to Upcoming Features</li>
                <li>✔ Peace of Mind 24/7</li>
              </ul>

              <div className="text-center mt-4">
                <h5 className="text-primary fw-semibold border-top pt-3">
                  Total Standard Package: R190
                </h5>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="col-md-6">
          <div className="ps-md-4">
            <h3 className="fw-semibold text-dark mb-3">Tag Features</h3>
            <p className="text-muted">
              Our <strong>30mm Round Nickel-Plated Tag</strong> combines durability and style.
              Rust-proof and lightweight, available in <strong>stainless steel</strong> or <strong>brass</strong>,
              it includes an “O” ring for quick and secure attachment to collars or harnesses.
            </p>
            <ul className="list-group list-group-flush border rounded shadow-sm">
              <li className="list-group-item">✅ Will not rust or tarnish</li>
              <li className="list-group-item">✅ Easy to apply and lightweight</li>
              <li className="list-group-item">✅ QR code links to pet profile</li>
              <li className="list-group-item">✅ Stylish and practical</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center mt-5">
        <Link to="/select-tag/standard" className="btn btn-primary btn-lg px-4 me-3">
          Purchase Now
        </Link>
        <a href="/NormalLearn" className="btn btn-outline-secondary btn-lg px-4">
          Learn More
        </a>
      </div>
    </div>
  );
}

export default Prices;
