/* eslint-disable no-unused-vars */
/* eslint-disable no-lone-blocks */
import React, { useState } from "react";
import "../styles/Home.css";
import TagModal from "../services/TagModal";
import "bootstrap-icons/font/bootstrap-icons.css";

function Home() {
  const [ModalData, setModalData] = useState({
    show: false,
    title: "",
    content: "",
    features: [],
    icons: [],
  });

  const handleShowModal = (title, content, features, icons) => {
    setModalData({ show: true, title, content, features, icons });
  };

  const handleCloseModal = () => {
    setModalData({
      show: false,
      title: "",
      content: "",
      features: [],
      icons: [],
    });
  };

  const standardTagFeatures = [
    { title: "Basic Identification", description: "A simple ID for your pet." },
    { title: "Durable", description: "Made from high-quality materials." },
  ];
  const standardTagIcons = ["bi-tag fs-4", "bi-shield fs-4"];

  const samsungTagFeatures = [
    {
      title: "Smart Tracking",
      description: "Works with Samsung devices for real-time tracking.",
    },
    {
      title: "Battery Life",
      description: "Long-lasting battery for your peace of mind.",
    },
  ];
  const samsungTagIcons = ["bi-phone fs-4", "bi-battery fs-4"];

  const appleTagFeatures = [
    {
      title: "iOS Compatibility",
      description: "Works seamlessly with Apple devices.",
    },
    {
      title: "Advanced Location Tracking",
      description: "Track your pet with the Found My app.",
    },
  ];
  const appleTagIcons = ["bi-apple fs-4", " fs-4 bi-geo-alt"];

  return (
    <div className="container col-xxl-8 px-4 py-5">
      {/* Hero Section */}
      <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
        <div className="col-10 col-sm-8 col-lg-6">
          <img
            src="/labwithtag.jpg"
            className="d-block mx-lg-auto img-fluid rounded shadow-lg"
            alt="Pet Tag"
            width="700"
            height="500"
            loading="lazy"
          />
        </div>
        <div className="col-lg-6">
          <h4 className="display-4 text-body-emphasis lh-1 mb-3">
            Keep Your Pets Safe with Found Your Pet
          </h4>
          <p className="lead">
            Found Your Pet is your trusted companion for keeping your pets safe.
            Easily register your pets, get personalized tags with QR codes.{" "}
            <strong>GPS enabled tags are coming soon</strong>
          </p>
          <a href="/Dashboard">
            <button className="btn btn-primary btn-lg" type="button">
              Get Started
            </button>
          </a>
        </div>
      </div>

      <hr />

      {/* Centered Section */}
      <div className="px-4 pt-5 my-5 text-center">
        <h4 className="display-3  text-body-emphasis">
          Pet QR Code Embeded Tags
        </h4>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-5">
            With Found Your Pet, your furry friend will wear a personalized
            identification tag around their neck. If they ever get lost, anyone
            who finds them can simply scan the tag to instantly access your
            contact information—helping reunite you with your pet quickly and
            safely.
          </p>
        </div>
      </div>

      {/* Tags Section */}
      <div className="container py-5 border-bottom" id="custom-cards">
        <h4 className="pb-4 display-4 fw-bold text-body-emphasis text-center">
          Tags We Offer
        </h4>

        <div className="row justify-content-center">
          {/* Standard Tag Card */}
          <div className="col-md-6 col-lg-4 text-center">
            <h2 className="mb-3 text-dark fw-bold">Standard Tag</h2>
            <p>
              Once you've registered, logged in, and added your pet, you'll be
              able to purchase the Standard Package. After that, you can explore
              and choose from a variety of tag options to best suit your pet’s
              style and needs.
            </p>
            <div className="card border-0 rounded-4 bg-light mb-3">
              <img
                src="/Standad-tagwithqrcode.png"
                alt="Standard Dog Tag"
                className="card-img-top p-4"
                style={{ objectFit: "contain" }}
              />
              <div className="card-body">
                <p className="card-text text-muted">
                  A basic dog tag used for pet identification, simple and
                  reliable.
                </p>
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg"
              onClick={() =>
                handleShowModal(
                  "Standard Tag",
                  "This is a basic dog tag used for pet identification.",
                  standardTagFeatures,
                  standardTagIcons
                )
              }
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Modal Component */}
        <TagModal
          show={ModalData.show}
          onClose={handleCloseModal}
          title={ModalData.title}
          content={ModalData.content}
          features={ModalData.features}
          icons={ModalData.icons}
        />
      </div>

      {/* Features Section */}
<section className="py-5 bg-light">
  <div className="container">
    <h2 className="display-4 text-center fw-bold text-body-emphasis mb-5">Features</h2>

    <div className="row align-items-center mb-5">
      <div className="col-md-6">
        <h3 className="fw-bold text-body-emphasis mb-3">Effortless Pet Tracking</h3>
        <p className="text-body-secondary">
          With Found Your Pet, once you've purchased the Standard Package, we take care of the rest. 
          A unique QR code is automatically generated for your pet's tag, which we professionally engrave 
          and deliver straight to your doorstep or nearest PUDO locker—ensuring your pet is always traceable 
          and never truly lost.
        </p>
      </div>
      <div className="col-md-6">
        <img src="/ChatGPT Image Apr 13, 2025, 03_20_00 PM.png" className="img-fluid" alt="Pet Tracking Illustration" />
      </div>
    </div>

    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
      <div className="col">
        <div className="card h-100 border-0 shadow-sm">
          <div className="card-body text-center">
            <div className="mb-3 fs-1 text-primary">
              <i className="bi bi-person-plus"></i>
            </div>
            <h5 className="card-title fw-semibold">Sign Up & Add Your Pet</h5>
            <p className="card-text text-body-secondary">
              Create your account, register your pet, and enter their details to get started on your journey with Found Your Pet.
            </p>
          </div>
        </div>
      </div>

      <div className="col">
        <div className="card h-100 border-0 shadow-sm">
          <div className="card-body text-center">
            <div className="mb-3 fs-1 text-success">
              <i className="bi bi-box-seam"></i>
            </div>
            <h5 className="card-title fw-semibold">Purchase the Standard Package</h5>
            <p className="card-text text-body-secondary">
              Unlock full access with the Standard Package, which includes a custom tag, unique QR code, engraving, delivery, and support.
            </p>
          </div>
        </div>
      </div>

      <div className="col">
        <div className="card h-100 border-0 shadow-sm">
          <div className="card-body text-center">
            <div className="mb-3 fs-1 text-warning">
              <i className="bi bi-qr-code-scan"></i>
            </div>
            <h5 className="card-title fw-semibold">Tag Activation & Delivery</h5>
            <p className="card-text text-body-secondary">
              After your purchase, we generate your pet’s QR code, engrave the tag, and deliver it to your door or nearest PUDO locker.
            </p>
          </div>
        </div>
      </div>

      <div className="col">
        <div className="card h-100 border-0 shadow-sm">
          <div className="card-body text-center">
            <div className="mb-3 fs-1 text-danger">
              <i className="bi bi-shield-check"></i>
            </div>
            <h5 className="card-title fw-semibold">Peace of Mind, Always</h5>
            <p className="card-text text-body-secondary">
              Anyone who finds your pet can scan the tag to view your contact details—helping them return home quickly and safely.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

    </div>
  );
}

export default Home;

{
  /* Samsung Tag */
}
{
  /* <div className="col">
            <div
              className="card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg"
              style={{
                backgroundImage: "url('/SamsungSmartTag.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
                <h6 className="pt-4 mt-5 mb-4 lh-1 fw-bold">
                  Samsung Smart tag
                </h6>
              </div>
              <button
                className="m-4 btn btn-primary"
                onClick={() =>
                  handleShowModal(
                    "Samsung Smart Tag",
                    "A smart tag that works with Samsung devices for tracking.",
                    samsungTagFeatures,
                    samsungTagIcons
                  )
                }
              >
                Learn More
              </button>
            </div>
          </div> */
}

{
  /* Apple Tag */
}
{
  /* <div className="col" style={{ height: "400px" }}>
            <div
              className="card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg"
              style={{
                backgroundImage: "url('/AppleAitTag.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="d-flex flex-column h-100 p-5 pb-3 text-shadow-1">
                <h6 className="pt-4 mt-5 mb-4  lh-1 fw-bold">Apple Air Tag</h6>
              </div>
              <button
                className="m-4 btn btn-primary"
                onClick={() =>
                  handleShowModal(
                    "Apple Air Tag",
                    "Apple's smart tracking tag for iOS devices.",
                    appleTagFeatures,
                    appleTagIcons
                  )
                }
              >
                Learn More
              </button>
            </div>
          </div>
        </div> */
}
