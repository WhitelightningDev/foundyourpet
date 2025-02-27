import React, { useState } from "react";
import "../styles/Home.css";
import TagModal from "../services/TagModal";
import 'bootstrap-icons/font/bootstrap-icons.css';


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
        setModalData({ show: false, title: "", content: "", features: [], icons: [] });
      };
    
      const standardTagFeatures = [
        { title: "Basic Identification", description: "A simple ID for your pet." },
        { title: "Durable", description: "Made from high-quality materials." },
      ];
      const standardTagIcons = ["bi-tag fs-4", "bi-shield fs-4"];
    
      const samsungTagFeatures = [
        { title: "Smart Tracking", description: "Works with Samsung devices for real-time tracking." },
        { title: "Battery Life", description: "Long-lasting battery for your peace of mind." },
      ];
      const samsungTagIcons = ["bi-phone fs-4", "bi-battery fs-4"];
    
      const appleTagFeatures = [
        { title: "iOS Compatibility", description: "Works seamlessly with Apple devices." },
        { title: "Advanced Location Tracking", description: "Track your pet with the Find My app." },
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
            Keep Your Pets Safe with Find Your Pet
          </h4>
          <p className="lead">
            Find Your Pet is your trusted companion for keeping your pets safe.
            Easily register your pets, get personalized tags with QR codes, and
            track them anytime, anywhere with our NFC-enabled tags.
          </p>
          <button className="btn btn-primary btn-lg" type="button">
            Get Started
          </button>
        </div>
      </div>

      <hr />

      {/* Centered Section */}
      <div className="px-4 pt-5 my-5 text-center">
        <h4 className="display-3  text-body-emphasis">
          Easy Pet Tracking with Custom Tags
        </h4>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-5">
            With Find Your Pet, you can choose from a variety of customizable
            tags and enjoy peace of mind knowing your pet’s safety is just a
            scan away.
          </p>
        </div>
      </div>

        {/* Tags Section */}
        <div className="container px-4 py-5 border-bottom" id="custom-cards">
        <h4 className="pb-2 display-3  text-body-emphasis text-center">Tags we offer</h4>

        <div className="row row-cols-1 row-cols-lg-3 align-items-stretch g-4 py-5">
          {/* Standard Tag */}
          <div className="col">
            <div
              className="card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg"
              style={{
                backgroundImage: "url('/NormalDogTag.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
                <h6 className="pt-3 mt-5 mb-4  lh-1 fw-bold">Standard Tag</h6>
              </div>
              <button
                className="m-4 btn btn-primary"
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

          {/* Samsung Tag */}
          <div className="col">
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
          </div>

          {/* Apple Tag */}
          <div className="col" style={{ height: "400px" }}>
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
      <h4 className="pb-2 display-3  text-body-emphasis text-center">Features</h4>
      <div className="row row-cols-1 row-cols-md-2 align-items-md-center g-5 py-5">
        <div className="col d-flex flex-column align-items-start gap-2">
          <h2 className="fw-bold text-body-emphasis">
            Effortless Pet Tracking
          </h2>
          <p className="text-body-secondary">
            With Find Your Pet, simply generate a unique QR code for your pet's
            tag, ensuring you never lose track of them again.
          </p>
        </div>

        <div className="col">
          <div className="row row-cols-1 row-cols-sm-2 g-4">
            <div className="col d-flex flex-column gap-2">
              <div className="feature-icon-small d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-4 rounded-3">
                <i className="bi bi-house-door"></i>
              </div>
              <h4 className="fw-semibold mb-0 text-body-emphasis">
                Pet Safety at Home
              </h4>
              <p className="text-body-secondary">
                Ensure your pet’s safety with a simple scan of the QR code or
                NFC-enabled tag, no matter where you are.
              </p>
            </div>

            <div className="col d-flex flex-column gap-2">
              <div className="feature-icon-small d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-4 rounded-3">
                <i className="bi bi-qr-code"></i>
              </div>
              <h4 className="fw-semibold mb-0 text-body-emphasis">
                Customizable Tags
              </h4>
              <p className="text-body-secondary">
                Choose from a variety of tag designs and upgrade to NFC-enabled
                tags for enhanced tracking.
              </p>
            </div>

            <div className="col d-flex flex-column gap-2">
              <div className="feature-icon-small d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-4 rounded-3">
                <i className="bi bi-geo-fill"></i>
              </div>
              <h4 className="fw-semibold mb-0 text-body-emphasis">
                Fast and Efficient Tracking
              </h4>
              <p className="text-body-secondary">
                Track your pet’s location quickly with real-time updates, no
                matter where they go.
              </p>
            </div>

            <div className="col d-flex flex-column gap-2">
              <div className="feature-icon-small d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-4 rounded-3">
                <i className="bi bi-speedometer2"></i>
              </div>
              <h4 className="fw-semibold mb-0 text-body-emphasis">
                Easy to Use Dashboard
              </h4>
              <p className="text-body-secondary">
                View all your pets in one place and manage their information
                with ease.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
