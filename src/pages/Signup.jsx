import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Toast, ToastContainer } from "react-bootstrap"; // Ensure Bootstrap Toast is imported

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    contact: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: {
      street: "",
      city: "",
      province: "",
      postalCode: "",
      country: "",
    },
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState(""); // 'success' or 'danger'
  const [showPassword, setShowPassword] = useState(false); // State for show/hide password

  // Handle form input changes
  // Handle form input changes, including nested address fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Toggle password visibility
  const handleShowPasswordChange = () => {
    setShowPassword(!showPassword);
  };

  // Input validation
  const validateInputs = () => {
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setToastMessage("Passwords do not match");
      setToastVariant("danger");
      setShowToast(true);
      return false;
    }

    // Additional checks for required fields (email, password length, etc.)
    if (
      !formData.email ||
      !formData.password ||
      !formData.name ||
      !formData.surname
    ) {
      setToastMessage("Please fill in all fields");
      setToastVariant("danger");
      setShowToast(true);
      return false;
    }

    return true;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateInputs()) {
      try {
        // Frontend: Ensure the full URL is specified
        const response = await axios.post(
          "http://localhost:5000/api/users/signup",
          formData
        );

        // Handle success
        setToastMessage(response.data.message || "Signup successful!");
        setToastVariant("success");
        setShowToast(true);

        // Redirect after successful signup (or navigate to another page)
        setTimeout(() => {
          window.location.href = "/login"; // Change to your desired page after success
        }, 2000);
      } catch (error) {
        // Handle error
        if (error.response) {
          setToastMessage(
            error.response.data.message || "Signup failed. Please try again."
          );
          setToastVariant("danger");
        } else {
          setToastMessage("An error occurred. Please try again.");
          setToastVariant("danger");
        }
        setShowToast(true);
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-body-secondary">
      <div className="modal-dialog mb-3 mt-3" style={{ maxWidth: "400px" }}>
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header p-3 border-bottom-0 text-center">
            <img
              className="rounded"
              src="/android-chrome-192x192.png"
              width="40px"
              alt="Logo"
            />
            <h2 className="fw-bold ms-2 fs-5">Sign Up</h2>
          </div>

          <div className="modal-body p-3">
            <form onSubmit={handleSubmit}>
              {/* First Name & Last Name Side by Side */}
              <div className="row g-2 mb-2">
                <div className="col">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control rounded-3"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="First Name"
                    />
                    <label>First Name</label>
                  </div>
                </div>
                <div className="col">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control rounded-3"
                      name="surname"
                      value={formData.surname}
                      onChange={handleChange}
                      placeholder="Last Name"
                    />
                    <label>Last Name</label>
                  </div>
                </div>
              </div>

              {/* Contact phone number */}
              <div className="row g-2 mb-2">
                <div className="col">
                  <div className="form-floating">
                    <input
                      type="contact"
                      className="form-control rounded-3"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      placeholder="+27"
                    />
                    <label>Contact</label>
                  </div>
                </div>
              </div>

              {/* Email & Password Side by Side */}
              <div className="row g-2 mb-2">
                <div className="col">
                  <div className="form-floating">
                    <input
                      type="email"
                      className="form-control rounded-3"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                    />
                    <label>Email</label>
                  </div>
                </div>
                
              </div>
              {/* Address Section */}
              <h6 className="mt-3 mb-2">Address</h6>
              <div className="form-floating mb-2">
                <input
                  type="text"
                  className="form-control rounded-3"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  placeholder="Street Address"
                />
                <label>Street Address</label>
              </div>

              <div className="row g-2 mb-2">
                <div className="col">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control rounded-3"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      placeholder="City"
                    />
                    <label>City</label>
                  </div>
                </div>
                <div className="col">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control rounded-3"
                      name="address.province"
                      value={formData.address.province}
                      onChange={handleChange}
                      placeholder="Province"
                    />
                    <label>Province</label>
                  </div>
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control rounded-3"
                      name="address.postalCode"
                      value={formData.address.postalCode}
                      onChange={handleChange}
                      placeholder="Postal Code"
                    />
                    <label>Postal Code</label>
                  </div>
                </div>
                <div className="col">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control rounded-3"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleChange}
                      placeholder="Country"
                    />
                    <label>Country</label>
                  </div>
                </div>
              </div>

              <div className="col mb-2">
                  <div className="form-floating">
                    <input
                      type={showPassword ? "text" : "password"} // Toggle password visibility
                      className="form-control rounded-3"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                    />
                    <label>Password</label>
                  </div>
                </div>

              {/* Confirm Password */}
              <div className="form-floating mb-2">
                <input
                  type={showPassword ? "text" : "password"} // Toggle password visibility
                  className="form-control rounded-3"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                />
                <label>Confirm Password</label>
              </div>

              {/* Show Password Checkbox */}
              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="showPassword"
                  onChange={handleShowPasswordChange}
                />
                <label className="form-check-label" htmlFor="showPassword">
                  Show Password
                </label>
              </div>

              {/* Signup Button */}
              <button
                className="w-100 btn btn-sm rounded-3 btn-primary"
                type="submit"
              >
                Sign Up
              </button>
              <small className="text-body-secondary d-block text-center mt-2">
                By signing up, you agree to the terms of use.
              </small>

              <hr className="my-2" />

              {/* Login Link */}
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-body-secondary">
                  Already have an account?
                </small>
                <Link to="/login" className="btn btn-outline-secondary btn-sm">
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Toast for Feedback */}
      <ToastContainer position="top-center">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={5000}
          autohide
        >
          <Toast.Body className={`text-white bg-${toastVariant}`}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default Signup;
