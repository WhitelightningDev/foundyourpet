import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toast, ToastContainer } from "react-bootstrap";

function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
  
    if (!email) {
      showToastMessage("Please enter your email address!");
      return;
    }
  
    // Get the token from localStorage or context (if required by the API)
    const authToken = localStorage.getItem("authToken");
  
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://foundyourpet-backend.onrender.com/api/users/password-reset",
        { email },
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // If needed by the API
          },
        }
      );
  
      if (response.status === 200) {
        showToastMessage("Password reset link sent! Please check your email.");
        setTimeout(() => navigate("/login"), 2000); // Redirect to login page
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 404:
            showToastMessage("User not found. Please check the email.");
            break;
          case 500:
            showToastMessage("Server error. Please try again later.");
            break;
          default:
            showToastMessage("An unexpected error occurred. Try again.");
        }
      } else {
        showToastMessage("Network error. Please check your connection.");
      }
    }
  };
  
  return (
    <div>
      <ToastContainer
        position="top-end"
        className="p-4"
        style={{ zIndex: 1050, color: "white" }}
      >
        <Toast
          show={showToast}
          bg={toastMessage.includes("sent") ? "success" : "danger"}
          onClose={() => setShowToast(false)}
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <div className="position-static d-flex justify-content-center align-items-center">
        <div className="modal-dialog mt-3 mb-3" style={{ maxWidth: "500px" }}>
          <div className="modal-content rounded-4 shadow">
            <div className="modal-header p-4 pb-3 border-bottom-0">
              <h1 className="fw-bold m-3 mb-0 fs-3">Password Reset</h1>
            </div>
            <div className="modal-body p-4 pt-0">
              <form onSubmit={handlePasswordReset}>
                <div className="form-floating mb-1">
                  <input
                    type="email"
                    className="form-control rounded-3"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label>Email address</label>
                </div>
                <button
                  className="w-100 mb-1 btn btn-lg rounded-3 btn-primary"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Sending reset link...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordResetPage;
