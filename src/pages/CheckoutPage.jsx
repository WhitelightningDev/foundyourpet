import { useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import axios from "axios";
import { useState } from "react";

function CheckoutPage() {
  const { state } = useLocation();
  const {
    package: pkg,
    total = 0,
    membership = false,
    selectedPets = [],
  } = state || {};

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    address2: "",
    country: "South Africa",
    province: "",
    zip: "",
  });

  const [errors, setErrors] = useState({});
  const membershipCost = membership ? 50 : 0;
  const subtotal = total + membershipCost;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ["firstName", "lastName", "address", "province", "zip"];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Postal code validation (assuming SA format)
    if (formData.zip && !/^\d{4}$/.test(formData.zip)) {
      newErrors.zip = "Please enter a valid postal code";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fix the errors in the form.");
      return;
    }

    let user = null;
    try {
      const storedUser = localStorage.getItem("user");
      user = storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
    }

    if (!user?._id) {
      alert("User not logged in or missing user ID.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/api/payment/createCheckout", {
        userId: user._id,
        petIds: selectedPets.map((pet) => pet._id),
        amountInCents: Math.round(subtotal * 100), // Total amount in cents
        membership,
        packageType: pkg?.type || "Standard",
        billingDetails: formData, // Pass billing details to the backend for metadata/log
      });

      if (response.data?.checkout_url) {
        window.location.href = response.data.checkout_url; // Redirect to Yoco checkout page
      } else {
        alert("Checkout URL not received. Please try again.");
      }
    } catch (err) {
      console.error("Checkout error:", err.response?.data || err.message);
      alert("There was an error initiating checkout. Please try again.");
    }
  };

  return (
    <Container className="my-5">
      <div className="row g-5">
        {/* Order Summary */}
        <div className="col-md-5 col-lg-4 order-md-last">
          <h4 className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-primary">Your cart</span>
            <span className="badge bg-primary rounded-pill">
              {selectedPets.length}
            </span>
          </h4>
          <ul className="list-group mb-3">
            {selectedPets.map((pet, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between lh-sm">
                <div>
                  <h6 className="my-0">{pet.name}</h6>
                  <small className="text-muted">
                    {pet.breed || "Unknown Breed"}, {pet.species}, {pet.size || "Unknown Size"}
                  </small>
                </div>
                <span className="text-muted">
                  R{(total / selectedPets.length).toFixed(2)}
                </span>
              </li>
            ))}
            {membership && (
              <li className="list-group-item d-flex justify-content-between bg-body-tertiary">
                <div className="text-success">
                  <h6 className="my-0">Membership</h6>
                  <small>Support package</small>
                </div>
                <span className="text-success">+R50</span>
              </li>
            )}
            <li className="list-group-item d-flex justify-content-between">
              <span><strong>Subtotal</strong></span>
              <strong>R{subtotal.toFixed(2)}</strong>
            </li>
          </ul>
        </div>

        {/* Billing Form */}
        <div className="col-md-7 col-lg-8">
          <h4 className="mb-3">Billing address</h4>
          <form className="needs-validation" noValidate onSubmit={handleCheckout}>
            <div className="row g-3">
              <div className="col-sm-6">
                <label htmlFor="firstName" className="form-label">First name</label>
                <input type="text" className="form-control" id="firstName" value={formData.firstName} onChange={handleChange} required />
                {errors.firstName && <small className="text-danger">{errors.firstName}</small>}
              </div>

              <div className="col-sm-6">
                <label htmlFor="lastName" className="form-label">Last name</label>
                <input type="text" className="form-control" id="lastName" value={formData.lastName} onChange={handleChange} required />
                {errors.lastName && <small className="text-danger">{errors.lastName}</small>}
              </div>

              <div className="col-12">
                <label htmlFor="email" className="form-label">Email <span className="text-body-secondary">(Optional)</span></label>
                <input type="email" className="form-control" id="email" value={formData.email} onChange={handleChange} />
                {errors.email && <small className="text-danger">{errors.email}</small>}
              </div>

              <div className="col-12">
                <label htmlFor="address" className="form-label">Address</label>
                <input type="text" className="form-control" id="address" value={formData.address} onChange={handleChange} required />
                {errors.address && <small className="text-danger">{errors.address}</small>}
              </div>

              <div className="col-12">
                <label htmlFor="address2" className="form-label">Address 2</label>
                <input type="text" className="form-control" id="address2" value={formData.address2} onChange={handleChange} />
              </div>

              <div className="col-md-5">
                <label htmlFor="country" className="form-label">Country</label>
                <select className="form-select" id="country" value={formData.country} onChange={handleChange} required>
                  <option value="">Choose...</option>
                  <option>South Africa</option>
                </select>
              </div>

              <div className="col-md-4">
                <label htmlFor="province" className="form-label">Province</label>
                <select className="form-select" id="province" value={formData.province} onChange={handleChange} required>
                  <option value="">Choose...</option>
                  <option>Gauteng</option>
                  <option>Western Cape</option>
                  <option>KwaZulu-Natal</option>
                  <option>Eastern Cape</option>
                  <option>Free State</option>
                  <option>Limpopo</option>
                  <option>Mpumalanga</option>
                  <option>North West</option>
                  <option>Northern Cape</option>
                </select>
                {errors.province && <small className="text-danger">{errors.province}</small>}
              </div>

              <div className="col-md-3">
                <label htmlFor="zip" className="form-label">Postal Code</label>
                <input type="text" className="form-control" id="zip" value={formData.zip} onChange={handleChange} required />
                {errors.zip && <small className="text-danger">{errors.zip}</small>}
              </div>
            </div>

            <hr className="my-4" />
            <button className="w-100 btn btn-primary btn-lg" type="submit">
              Continue to checkout
            </button>
          </form>
        </div>
      </div>
    </Container>
  );
}

export default CheckoutPage;
