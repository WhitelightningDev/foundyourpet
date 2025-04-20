/* eslint-disable no-lone-blocks */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { Link } from "react-router-dom";

function Features() {
  return (
    <div>
      {/* Hero Section */}
      <section className="text-center py-5 bg-light">
        <div className="container">
          <img
            src="/android-chrome-192x192.png"
            className="rounded mb-4"
            alt="Find Your Pet"
            width="100"
            height="100"
          />
          <h1 className="display-4 fw-bold text-body-emphasis">Features</h1>
          <p className="lead mx-auto" style={{ maxWidth: "700px" }}>
            At <strong>Find Your Pet</strong>, we’re committed to providing reliable and user-friendly pet safety solutions.
            <br />
            <strong className="text-primary">GPS tracking tags are coming soon</strong> — bringing real-time peace of mind
            for pet parents everywhere.
          </p>
        </div>
      </section>

      {/* Standard Tag Section */}
      <section className="container py-5">
        <div className="row g-5 align-items-center">
          <div className="col-md-6">
            <h2 className="fw-bold mb-3">Standard Tag</h2>
            <img
              src="/standard-dogtag.png"
              alt="Standard Dog Tag"
              className="img-fluid rounded shadow-sm mb-4"
              style={{ maxWidth: "200px" }}
            />
            <p className="text-body-secondary">
              Our <strong>Standard Tag</strong> offers a durable, easy-to-use identification method for your pet.
              Each tag features a scannable QR code and unique ID linked to your pet's profile— including your contact
              info, medical notes, and emergency instructions.
            </p>
            <div className="d-flex gap-3 mt-4 justify-content-center">
              <Link to="/Dashboard" className="btn btn-primary btn-lg px-4 py-2">
                Purchase
              </Link>
              <Link to="/NormalLearn" className="btn btn-outline-secondary btn-lg px-4 py-2">
                Learn More
              </Link>
            </div>
          </div>

          <div className="col-md-6">
            <div className="row g-4">
              {[{
                icon: "bi-lightbulb",
                title: "Simplicity",
                desc: "Ideal for pet owners seeking a low-tech, dependable identification solution.",
              },
              {
                icon: "bi-box-seam",
                title: "Durable Design",
                desc: "Crafted from premium materials to endure everyday adventures.",
              },
              {
                icon: "bi-cash-stack",
                title: "Affordable",
                desc: "An economical way to protect your pet—without complex tech.",
              },
              {
                icon: "bi-battery-full",
                title: "No Battery Required",
                desc: "Just scan and go. No charging or maintenance needed.",
              }].map((feature, i) => (
                <div key={i} className="col-sm-6">
                  <div className="d-flex align-items-start gap-3">
                    {/* Icon Container */}
                    <div className="bg-primary-subtle rounded-circle p-4 shadow-sm d-flex align-items-center justify-content-center">
                      <i className={`bi ${feature.icon} fs-4 text-primary`}></i>
                    </div>
                    <div>
                      <h5 className="fw-semibold text-body-emphasis">{feature.title}</h5>
                      <p className="text-body-secondary small">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Features;
