import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Toast, ToastContainer } from "react-bootstrap";

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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  const handleShowPasswordChange = () => {
    setShowPassword(!showPassword);
  };

  const validateInputs = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "First name is required";
    if (!formData.surname) newErrors.surname = "Last name is required";
    if (!formData.contact) newErrors.contact = "Contact number is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password && formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm your password";
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    )
      newErrors.confirmPassword = "Passwords do not match";

    const addressFields = ["street", "city", "province", "postalCode", "country"];
    addressFields.forEach((field) => {
      if (!formData.address[field]) {
        newErrors[`address.${field}`] = `${field[0].toUpperCase() + field.slice(1)} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateInputs()) {
      setIsLoading(true);
      try {
        const response = await axios.post(
          "https://foundyourpet-backend.onrender.com/api/users/signup",
          formData
        );

        setToastMessage(response.data.message || "Signup successful!");
        setToastVariant("success");
        setShowToast(true);

        setTimeout(() => {
          window.location.href = "/signup-success";
          setIsLoading(false);
        }, 2000);
      } catch (error) {
        if (error.response) {
          setToastMessage(error.response.data.message || "Signup failed. Please try again.");
        } else {
          setToastMessage("An error occurred. Please try again.");
        }
        setToastVariant("danger");
        setShowToast(true);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-body-secondary">
      <div
        className="modal-dialog border-3 rounded-5 shadow-lg mb-3 mt-3"
        style={{ minHeight: "100vh", overflowY: "auto", paddingTop: "20px" }}
      >
        <div className="modal-content">
          <div className="modal-header p-3 border-bottom-0 text-center">
            <img className="rounded m-3" src="/android-chrome-192x192.png" width="70px" alt="Logo" />
            <h1 className="fw-bold ms-2 fs-2">Sign Up</h1>
          </div>

          <div className="modal-body p-3">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* User Details Column */}
                <div className="col-12 col-md-6">
                  <h6 className="mb-2">User Details</h6>

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
                          required
                        />
                        {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
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
                          required
                        />
                        {errors.surname && <div className="text-danger small mt-1">{errors.surname}</div>}
                        <label>Last Name</label>
                      </div>
                    </div>
                  </div>

                  <div className="form-floating mb-2">
                    <input
                      type="text"
                      className="form-control rounded-3"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      placeholder="+27"
                      required
                    />
                    {errors.contact && <div className="text-danger small mt-1">{errors.contact}</div>}
                    <label>Cell Number</label>
                  </div>

                  <div className="form-floating mb-2">
                    <input
                      type="email"
                      className="form-control rounded-3"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      required
                    />
                    {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                    <label>Email</label>
                  </div>
                </div>

                {/* Address Column */}
                <div className="col-12 col-md-6">
                  <h6 className="mb-2">Address Information</h6>

                  <div className="form-floating mb-2">
                    <input
                      type="text"
                      className="form-control rounded-3"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      placeholder="Street Address"
                      required
                    />
                    {errors["address.street"] && (
                      <div className="text-danger small mt-1">{errors["address.street"]}</div>
                    )}
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
                          required
                        />
                        {errors["address.city"] && (
                          <div className="text-danger small mt-1">{errors["address.city"]}</div>
                        )}
                        <label>City</label>
                      </div>
                    </div>

                    <div className="col">
                      <div className="form-floating">
                        <select
                          className="form-select rounded-3"
                          name="address.province"
                          value={formData.address.province}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Province</option>
                          <option value="Eastern Cape">Eastern Cape</option>
                          <option value="Free State">Free State</option>
                          <option value="Gauteng">Gauteng</option>
                          <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                          <option value="Limpopo">Limpopo</option>
                          <option value="Mpumalanga">Mpumalanga</option>
                          <option value="North West">North West</option>
                          <option value="Northern Cape">Northern Cape</option>
                          <option value="Western Cape">Western Cape</option>
                        </select>
                        {errors["address.province"] && (
                          <div className="text-danger small mt-1">{errors["address.province"]}</div>
                        )}
                        <label>Province</label>
                      </div>
                    </div>
                  </div>

                  <div className="row g-2 mb-2">
                    <div className="col">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control rounded-3"
                          name="address.postalCode"
                          value={formData.address.postalCode}
                          onChange={handleChange}
                          placeholder="Postal Code"
                          required
                        />
                        {errors["address.postalCode"] && (
                          <div className="text-danger small mt-1">{errors["address.postalCode"]}</div>
                        )}
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
                          required
                        />
                        {errors["address.country"] && (
                          <div className="text-danger small mt-1">{errors["address.country"]}</div>
                        )}
                        <label>Country</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Fields */}
              <div className="form-floating mb-2 mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control rounded-3"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
                {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
                <label>Password</label>
              </div>

              <div className="form-floating mb-2">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control rounded-3"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                />
                {errors.confirmPassword && (
                  <div className="text-danger small mt-1">{errors.confirmPassword}</div>
                )}
                <label>Confirm Password</label>
              </div>

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

              <button
              style={{ width: "200px"}}
                className="btn btn-md rounded-3 btn-primary"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    Signing you up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>

              <small className="text-body-secondary d-block text-center mt-2">
                By signing up, you agree to the terms of use.
              </small>

              <hr className="my-2" />

              <div className="d-flex justify-content-between align-items-center">
                <small className="text-body-secondary">Already have an account?</small>
                <Link to="/login" className="btn m-3 btn-outline-secondary btn-sm">Login</Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" className="position-fixed top-0 start-50 translate-middle-x mt-3" style={{ zIndex: 2000 }}>
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={5000} autohide>
          <Toast.Body className={`text-white bg-${toastVariant}`}>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default Signup;
