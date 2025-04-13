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
        <strong className="text-primary">GPS tracking tags are coming soon</strong> —bringing real-time peace of mind
        for pet parents everywhere.
      </p>
    </div>
  </section>

  {/* Standard Tag Section */}
  <section className="container py-5">
    <div className="row g-5 align-items-center">
      <div className="col-md-6">
        <h2 className="fw-bold text-body-emphasis mb-3">Standard Tag</h2>
        <img
          src="/standard-dogtag.png"
          alt="Standard Dog Tag"
          className="img-fluid rounded shadow-sm mb-4"
          style={{ maxWidth: "250px" }}
        />
        <p className="text-body-secondary">
          Our <strong>Standard Tag</strong> offers a durable, easy-to-use identification method for your pet.
          Each tag features a scannable QR code and unique ID linked to your pet's profile—
          including your contact info, medical notes, and emergency instructions.
        </p>
        <div className="d-flex gap-3 mt-4">
          <Link to="/Dashboard" className="btn btn-primary btn-lg">
            Purchase
          </Link>
          <Link to="/NormalLearn" className="btn btn-outline-secondary btn-lg">
            Learn More
          </Link>
        </div>
      </div>

      <div className="col-md-6">
        <div className="row g-4">
          {[
            {
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
            },
          ].map((feature, i) => (
            <div key={i} className="col-sm-6">
              <div className="d-flex align-items-start gap-3">
                <div className="bg-primary-subtle rounded-circle p-3">
                  <i className={`bi ${feature.icon} fs-2 text-primary`}></i>
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


 {/* <div class="container px-4 py-5">
        <h2 class="pb-2 border-bottom">Samsung Smart Tag</h2>
        <div class="row row-cols-1 row-cols-md-2 align-items-md-center g-5 py-5">
          <div class="col d-flex flex-column align-items-start gap-2">
            <h2 class="fw-bold text-body-emphasis">
              Advanced Tracking for Samsung Users
            </h2>
            <img
              className="card card-cover h-100 rounded border-0"
              src="/samsung-smarttag.png"
              style={{ width: "200px" }}
            />
            <p class="text-body-secondary">
              The Samsung Smart Tag is a next-level solution for pet owners who
              want to leverage the power of their Samsung devices for real-time
              tracking. With this tag, you can pair it with your Samsung phone
              or tablet and track your pet’s location wherever they go. It's an
              ideal choice for those who prefer seamless integration with their
              Samsung devices.
            </p>

            <Link to="/Dashboard" className="btn btn-primary btn-lg">
              Purchase
            </Link>
            <Link to="/SamsungLearn" className="btn btn-secondary btn-lg">
              Learn More
            </Link>
          </div>

          <div className="col">
            <div className="row row-cols-1 row-cols-sm-2 g-4">
              <div className="col d-flex flex-column gap-2">
                <div className="feature-icon-small d-inline-flex align-items-start justify-content-start bg-gradient fs-4 rounded-3">
                  <i className="fs-2 bi bi-pin-map-fill text-dark"></i>
                </div>
                <h4 className="fw-semibold mb-0 text-body-emphasis">
                  Real-Time Location Tracking
                </h4>
                <p className="text-body-secondary">
                  Perfect for those who want a straightforward, low-tech
                  solution for pet identification
                </p>
              </div>

              <div className="col d-flex flex-column gap-2">
                <div className="feature-icon-small d-inline-flex align-items-start justify-content-start bg-gradient fs-4 rounded-3">
                  <i className="fs-2 bi bi-bell text-dark"></i>
                </div>
                <h4 className="fw-semibold mb-0 text-body-emphasis">
                  Smart Notifications
                </h4>
                <p className="text-body-secondary">
                  Receive alerts when your pet leaves a designated safe area or
                  comes too close to a restricted zone.
                </p>
              </div>

              <div className="col d-flex flex-column gap-2">
                <div className="feature-icon-small d-inline-flex align-items-start justify-content-start bg-gradient fs-4 rounded-3">
                  <i className="fs-2 bi bi-battery-full text-dark"></i>
                </div>
                <h4 className="fw-semibold mb-0 text-body-emphasis">
                  Long Battery Life
                </h4>
                <p className="text-body-secondary">
                  With energy-efficient features, the Samsung Smart Tag offers
                  long-lasting battery life.
                </p>
              </div>

              <div className="col d-flex flex-column gap-2">
                <div className="feature-icon-small d-inline-flex align-items-start justify-content-start bg-gradient fs-4 rounded-3">
                  <i className="fs-2 bi bi-phone text-dark"></i>
                </div>
                <h4 className="fw-semibold mb-0 text-body-emphasis">
                  Compatible with Samsung Devices
                </h4>
                <p className="text-body-secondary">
                  Perfect for Samsung Galaxy phone users who want to track their
                  pets directly from their device.
                </p>
              </div>

              <div className="col d-flex flex-column gap-2">
                <div className="feature-icon-small d-inline-flex align-items-start justify-content-start bg-gradient fs-4 rounded-3">
                  <i className="fs-2 bi bi-feather text-dark"></i>
                </div>
                <h4 className="fw-semibold mb-0 text-body-emphasis">
                  Additional Features
                </h4>
                <p className="text-body-secondary">
                  Works with Samsung’s SmartThings app, providing an additional
                  layer of functionality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* <div class="container px-4 py-5">
        <h2 class="pb-2 border-bottom">Apple Air Tag</h2>
        <div class="row row-cols-1 row-cols-md-2 align-items-md-center g-5 py-5">
          <div class="col d-flex flex-column align-items-start gap-2">
            <h2 class="fw-bold text-body-emphasis">
              Seamless Integration with Apple Ecosystem
            </h2>
            <img
              className="card card-cover h-100 rounded border-0"
              src="/apple-airtag.png"
              style={{ width: "200px" }}
            />
            <p class="text-body-secondary">
              For Apple users, the Apple Air Tag offers a seamless solution for
              pet tracking. Designed to integrate effortlessly with the Apple
              ecosystem, the Air Tag uses the Find My network to provide
              accurate and real-time location tracking. It’s perfect for those
              who prefer Apple's intuitive software and want the convenience of
              tracking their pets via their iPhone or iPad.
            </p>
            <Link to="/Dashboard" className="btn btn-primary btn-lg">
              Purchase
            </Link>
            <Link to="/AppleLearn" className="btn btn-secondary btn-lg">
              Learn More
            </Link>
          </div>

          <div className="col">
            <div className="row row-cols-1 row-cols-sm-2 g-4">
              <div className="col d-flex flex-column gap-2">
                <div className="feature-icon-small d-inline-flex align-items-start justify-content-start bg-gradient fs-4 rounded-3">
                  <i className="fs-2 bi bi-pin-map-fill text-dark"></i>
                </div>
                <h4 className="fw-semibold mb-0 text-body-emphasis">
                  Precise Tracking with Find My
                </h4>
                <p className="text-body-secondary">
                  The Apple Air Tag utilizes the extensive Find My network,
                  giving you precise tracking of your pet’s location.
                </p>
              </div>

              <div className="col d-flex flex-column gap-2">
                <div className="feature-icon-small d-inline-flex align-items-start justify-content-start bg-gradient fs-4 rounded-3">
                  <i className="fs-2 bi bi-shield-check text-dark"></i>
                </div>
                <h4 className="fw-semibold mb-0 text-body-emphasis">
                  Privacy & Security
                </h4>
                <p className="text-body-secondary">
                  Apple’s encryption ensures that your pet’s location is always
                  secure and accessible only to you.
                </p>
              </div>

              <div className="col d-flex flex-column gap-2">
                <div className="feature-icon-small d-inline-flex align-items-start justify-content-start bg-gradient fs-4 rounded-3">
                  <i className="fs-2 bi bi-link text-dark"></i>
                </div>
                <h4 className="fw-semibold mb-0 text-body-emphasis">
                  No Setup Required
                </h4>
                <p className="text-body-secondary">
                  Simply attach the Air Tag to your pet’s collar, and it will
                  automatically pair with your Apple device.
                </p>
              </div>

              <div className="col d-flex flex-column gap-2">
                <div className="feature-icon-small d-inline-flex align-items-start justify-content-start bg-gradient fs-4 rounded-3">
                  <i className="fs-2 bi bi-battery-full text-dark"></i>
                </div>
                <h4 className="fw-semibold mb-0 text-body-emphasis">
                  Battery Life
                </h4>
                <p className="text-body-secondary">
                  Air Tags come with a replaceable battery that lasts up to a
                  year, giving you peace of mind.
                </p>
              </div>

              <div className="col d-flex flex-column gap-2">
                <div className="feature-icon-small d-inline-flex align-items-start justify-content-start bg-gradient fs-4 rounded-3">
                  <i className="fs-2 bi bi-apple text-dark"></i>
                </div>
                <h4 className="fw-semibold mb-0 text-body-emphasis">
                  Works with Apple Devices
                </h4>
                <p className="text-body-secondary">
                  The perfect solution for those who already use Apple products
                  and want a seamless experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div> */}