/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

function TsAndCs() {
  return (
    <div className="px-4 py-5 my-5 text-center">
      <img
        className="d-block mx-auto mb-4 rounded-3 shadow-lg"
        src="android-chrome-192x192.png"
        alt=""
        width="120"
        height="120"
      />
      <h1 className="display-5 fw-bold text-body-emphasis">Terms and Conditions</h1>
      <div className="col-lg-8 mx-auto text-start">
        <p className="lead mb-4">
          Welcome to Found Your Pet. By accessing or using our website, purchasing products or services, or registering as a user, you agree to comply with and be bound by the following terms and conditions.
        </p>

        <div className="mb-4">
          <h5><i className="bi bi-info-circle-fill me-2"></i>1. Overview</h5>
          <p>
            Found Your Pet provides digital pet ID tags with dynamic QR codes, enabling pet finders to notify owners when a lost pet is found. We offer both free and paid services, including a Standard Membership package.
          </p>
        </div>

        <div className="mb-4">
          <h5><i className="bi bi-credit-card-2-front-fill me-2"></i>2. Membership and Purchases</h5>
          <p>
            By purchasing the Standard Membership, you gain access to additional services such as support, tag replacement, and future member-exclusive benefits. All membership and product purchases are non-refundable unless stated otherwise.
          </p>
        </div>

        <div className="mb-4">
          <h5><i className="bi bi-qr-code-scan me-2"></i>3. Tag and QR Code Use</h5>
          <p>
            Each pet tag includes a dynamic QR code linked to your pet's profile. Scanning the QR code will display publicly viewable information such as the pet’s name, breed, photo, and your chosen contact method (e.g., phone number or email). You are responsible for ensuring the accuracy and appropriateness of the information you choose to make publicly available.
          </p>
        </div>

        <div className="mb-4">
          <h5><i className="bi bi-truck me-2"></i>4. Delivery and Fulfillment</h5>
          <p>
            Tags are custom-made and delivered to the address you provide during checkout. Delivery times may vary based on location and supplier delays.
          </p>
        </div>

        <div className="mb-4">
          <h5><i className="bi bi-globe2 me-2"></i>5. Website Use</h5>
          <p>
            You agree not to use the website for any unlawful or abusive activities. We reserve the right to suspend or terminate any user account at our discretion for violating these terms.
          </p>
        </div>

        <div className="mb-4">
          <h5><i className="bi bi-shield-exclamation me-2"></i>6. Limitation of Liability</h5>
          <p>
            Found Your Pet is not responsible or liable for locating or returning lost pets. We merely provide tools and services that facilitate connection between pet finders and owners.
          </p>
        </div>

        <div className="mb-4">
          <h5><i className="bi bi-person-x-fill me-2"></i>7. Termination</h5>
          <p>
            We reserve the right to terminate or restrict your access to our services if we believe you are violating these terms or acting in a harmful manner.
          </p>
        </div>

        <div className="mb-4">
          <h5><i className="bi bi-arrow-repeat me-2"></i>8. Modifications</h5>
          <p>
            We may update these terms from time to time. Continued use of the service constitutes your acceptance of any modifications.
          </p>
        </div>
      </div>
    </div>
  );
}

export default TsAndCs;
