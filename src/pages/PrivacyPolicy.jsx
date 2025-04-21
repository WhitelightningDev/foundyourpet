import React from "react";

function PrivacyPolicy() {
  return (
    <div className="px-4 py-5 my-5 text-center">
      <img
        className="d-block mx-auto mb-4 rounded-3 shadow-lg"
        src="android-chrome-192x192.png"
        alt="Found Your Pet Logo"
        width="120"
        height="120"
      />
      <h1 className="display-5 fw-bold text-body-emphasis">Privacy Policy</h1>
      <div className="col-lg-8 mx-auto text-start">
        <p className="lead mb-4">
          At Found Your Pet, we are committed to protecting your privacy and the personal information you provide to us. This Privacy Policy explains how we collect, use, and disclose information.
        </p>

        <div className="mb-4">
          <h5><i className="bi bi-person-fill-lock me-2"></i>1. Information We Collect</h5>
          <p>
            We collect personal data such as your name, email address, phone number, and pet details when you sign up, add a pet, or purchase a tag. We also collect technical data through cookies and usage logs to improve your experience.
          </p>
        </div>

        <div className="mb-4">
          <h5><i className="bi bi-eye-fill me-2"></i>2. Publicly Visible Information</h5>
          <p>
            When a QR code is scanned, publicly viewable information such as your pet’s name, breed, photo, and your chosen contact method (e.g., phone number or email) will be displayed. You control what is visible and may update or remove it at any time.
          </p>
        </div>

        <div className="mb-4">
          <h5><i className="bi bi-shield-lock-fill me-2"></i>3. How We Use Your Information</h5>
          <p>
            We use your information to provide services, process transactions, manage accounts, and improve our website. Your information is never sold to third parties.
          </p>
        </div>

        <div className="mb-4">
          <h5><i className="bi bi-lock-fill me-2"></i>4. Data Security</h5>
          <p>
            We take appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
          </p>
        </div>

        <div className="mb-4">
          <h5><i className="bi bi-people-fill me-2"></i>5. Third-Party Services</h5>
          <p>
            We may use third-party services (e.g., payment processors) to facilitate your transactions. These providers are only given access to information necessary for their function and are obligated to protect your data.
          </p>
        </div>

        <div className="mb-4">
          <h5><i className="bi bi-gear-fill me-2"></i>6. Your Rights and Choices</h5>
          <p>
            You have the right to view, update, or delete your personal information. If you wish to deactivate your account or request data deletion, please contact us at support@foundyourpet.co.za.
          </p>
        </div>

        <div className="mb-4">
          <h5><i className="bi bi-arrow-repeat me-2"></i>7. Policy Updates</h5>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. Continued use of our service after changes constitutes acceptance of the revised policy.
          </p>
        </div>

        <div className="mb-4">
          <h5><i className="bi bi-envelope-fill me-2"></i>8. Contact Us</h5>
          <p>
            If you have any questions about this Privacy Policy or your personal data, please contact us at <strong>support@foundyourpet.co.za</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
