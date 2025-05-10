import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Toast, ToastContainer } from "react-bootstrap";
// Import your AuthContext if using one
import { AuthContext } from "../context/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // ADD this line
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password) {
      showToastMessage("All fields are required!");
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showToastMessage("Please enter a valid email address!");
      return false;
    }
    return true;
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setIsLoading(true); 
  
    try {
      const response = await axios.post(
        "https://foundyourpet-backend.onrender.com/api/users/login",
        { email, password }
      );
  
      if (response.status === 200) {
        const { token, user } = response.data;
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        login(token);
  
        showToastMessage("Login successful! Redirecting...");
  
        const redirectPath = user?.isAdmin ? "/admin-dashboard" : "/dashboard";
  
        setTimeout(() => {
          navigate(redirectPath);
          setIsLoading(false);
        }, 2000);
      }
    } catch (error) {
      setIsLoading(false); 
      handleLoginError(error);
    }
  };
  
  const handleLoginError = (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const message = data.error || data.message || "An unexpected error occurred.";
  
      switch (status) {
        case 400:
          showToastMessage("Oops: " + message);
          break;
        case 401:
          showToastMessage("Incorrect email or password.");
          break;
        case 404:
          showToastMessage("User not found. Please sign up.");
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
          bg={toastMessage.includes("successful") ? "success" : "danger"}
          onClose={() => setShowToast(false)}
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <div className="position-static d-block bg-body-secondary d-flex justify-content-center align-items-center">
        <div className="modal-dialog mt-3 mb-3" style={{ maxWidth: "500px" }}>
          <div className="modal-content rounded-4 shadow">
            <div className="modal-header p-4 pb-3 border-bottom-0">
              <img
                className="rounded"
                src="/android-chrome-192x192.png"
                width="50px"
                alt="Logo"
              />
              <h1 className="fw-bold m-3 mb-0 fs-3">Login</h1>
            </div>
            <div className="modal-body p-4 pt-0">
              <form onSubmit={handleSubmit}>
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
                <div className="form-floating mb-1">
                  <input
                    type="password"
                    className="form-control rounded-3"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label>Password</label>
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
                      Logging you in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>

                <small className="text-body-secondary">
                  By clicking Login, you agree to the terms of use.
                </small>
                <hr className="my-3" />

                <div className="d-flex justify-content-between">
                  <Link
                    to="/password-reset"
                    className="btn btn-outline-secondary"
                  >
                    Forgot Password
                  </Link>
                  <Link to="/Signup" className="btn btn-outline-secondary">
                    Signup
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
