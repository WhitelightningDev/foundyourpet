import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Toast, ToastContainer } from "react-bootstrap";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

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
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    try {
      const response = await axios.post("http://localhost:5000/api/users/login", { email, password });
      if (response.status === 200) {
        showToastMessage("Login successful! Redirecting...");
        const token = response.data.token;
        localStorage.setItem("authToken", token); // Save the token in localStorage
        login(token); // Call login function from context, if you're using context
        setTimeout(() => navigate("/dashboard"), 2000); // Redirect to dashboard
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        console.error("Login Error:", data.error || data.message);

        switch (status) {
          case 400:
            showToastMessage("Bad Request: " + (data.error || "Invalid input."));
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
    }
  };

  return (
    <div>
        <div>
        <ToastContainer position="scroll" className="top-0 end-0 p-3" style={{ zIndex: 1050 }}>
        <Toast show={showToast} bg="danger" onClose={() => setShowToast(false)}>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
        </div>
        <div className=" position-static d-block bg-body-secondary  d-flex justify-content-center align-items-center">
        <div className="modal-dialog mb-3" style={{ maxWidth: "500px" }}>
          <div className="modal-content rounded-4 shadow">
            <div className="modal-header p-4 pb-3 border-bottom-0">
              <img className="rounded" src="/android-chrome-192x192.png" width="50px" alt="Logo" />
              <h1 className="fw-bold m-3 mb-0 fs-3">Login</h1>
            </div>
            <div className="modal-body p-4 pt-0">
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-1">
                  <input type="email" className="form-control rounded-3" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <label>Email address</label>
                </div>
                <div className="form-floating mb-1">
                  <input type="password" className="form-control rounded-3" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <label>Password</label>
                </div>
                <button className="w-100 mb-1 btn btn-lg rounded-3 btn-primary" type="submit">Login</button>
                <small className="text-body-secondary">By clicking Login, you agree to the terms of use.</small>
                <hr className="my-3" />
                <div className="d-flex justify-content-between">
                  <button className="btn btn-outline-secondary" type="button">Forgot Password</button>
                  <Link to="/Signup" className="btn btn-outline-secondary">Signup</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      </div>

  );
}

export default Login;