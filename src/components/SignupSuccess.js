import React from "react";

const SignupSuccess = () => {
  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <img
          src="/android-chrome-192x192.png"
          alt="Found Your Pet Logo"
          className="mb-2 rounded-3 shadow-lg"
          width="100"
          height="100"
        />
        <div><img
          src="/check.png"
          alt="Success Check"
          className="mb-4 mt-3"
          width="72"
          height="72"
        /></div>
        <h1 className="display-5 fw-bold text-dark mb-2">Signup Successful</h1>
        <p className="lead text-secondary mb-4">
          Thank you for signing up! Please check your email to verify your account and complete the registration process.
        </p>
        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
          <a href="/login" className="btn btn-success btn-lg px-4 me-sm-3">
            Go to Login
          </a>
          <a href="/" className="btn btn-outline-secondary btn-lg px-4">
            Return Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignupSuccess;
