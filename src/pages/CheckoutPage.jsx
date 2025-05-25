import { useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import BillingForm from "../components/BillingForm";

function CheckoutPage() {
  const { state } = useLocation();
  const {
    package: pkg,
    total = 0,
    membership = false,
    membershipObjectId,
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

  const MEMBERSHIP_COST = 50;
  const membershipCost = membership ? MEMBERSHIP_COST : 0;
  const subtotal = total + membershipCost;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ["firstName", "lastName", "address", "province", "zip"];

    requiredFields.forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = "This field is required";
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

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
        amountInCents: Math.round(subtotal * 100),
        membership,
        membershipId: membershipObjectId,
        packageType: pkg?.type || "Standard",
        billingDetails: formData,
      });

      if (response.data?.checkout_url) {
        window.location.href = response.data.checkout_url;
      } else {
        alert("Checkout URL not received. Please try again.");
      }
    } catch (err) {
      console.error("Checkout error:", err.response?.data || err.message);
      alert("There was an error initiating checkout. Please try again.");
    }
  };

  return (
    <main
      style={{
        maxWidth: 960,
        margin: "3rem auto",
        padding: "0 2rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#222",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "3rem",
          flexWrap: "nowrap", // prevent wrapping
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        {/* Order Summary */}
        <section
          style={{
            flex: "0 0 320px", // fixed width for cart on left
            position: "sticky",
            top: "2rem",
            borderRadius: 12,
            padding: "2rem",
            backgroundColor: "#f9fafb",
            boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
            height: "fit-content",
            border: "1px solid #e2e8f0",
          }}
        >
          <h4
            style={{
              fontWeight: 700,
              fontSize: "1.3rem",
              marginBottom: "1.5rem",
              color: "#2563eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Your Cart
            <span
              style={{
                backgroundColor: "#2563eb",
                color: "#fff",
                borderRadius: "9999px",
                padding: "0.3rem 0.85rem",
                fontWeight: 700,
                fontSize: "0.9rem",
                boxShadow: "0 1px 4px rgba(37,99,235,0.5)",
              }}
            >
              {selectedPets.length}
            </span>
          </h4>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              borderTop: "1px solid #e5e7eb",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            {selectedPets.map((pet, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "1rem 0",
                  borderBottom:
                    index !== selectedPets.length - 1 ? "1px solid #e5e7eb" : "none",
                }}
              >
                <div>
                  <h6 style={{ margin: 0, fontWeight: 600, fontSize: "1rem" }}>
                    {pet.name}
                  </h6>
                  <small style={{ color: "#6b7280", fontStyle: "italic" }}>
                    {pet.breed || "Unknown Breed"}, {pet.species},{" "}
                 
                  </small>
                </div>
                <span style={{ color: "#374151", fontWeight: 600 }}>
                  R{(total / selectedPets.length).toFixed(2)}
                </span>
              </li>
            ))}

            {membership && (
              <li
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "1rem 0",
                  backgroundColor: "#e0f2fe",
                  borderBottom: "1px solid #e5e7eb",
                  borderRadius: "0 0 12px 12px",
                }}
              >
                <div style={{ color: "#0284c7" }}>
                  <h6 style={{ margin: 0, fontWeight: 600 }}>Membership</h6>
                  <small style={{ fontStyle: "italic" }}>Support package</small>
                </div>
                <span style={{ color: "#0284c7", fontWeight: 700 }}>
                  +R{MEMBERSHIP_COST}
                </span>
              </li>
            )}

            <li
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "1.25rem 0 0 0",
                fontWeight: 700,
                fontSize: "1.15rem",
                color: "#111827",
              }}
            >
              <span>Subtotal</span>
              <span>R{subtotal.toFixed(2)}</span>
            </li>
          </ul>
        </section>

        {/* Billing Form */}
        <section
          style={{
            flex: "1 1 auto", // takes remaining space
            maxWidth: 600,
            backgroundColor: "#fff",
            padding: "2rem",
            borderRadius: 12,
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            border: "1px solid #e5e7eb",
          }}
        >
          <BillingForm
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleCheckout={handleCheckout}
          />
        </section>
      </div>
    </main>
  );
}

export default CheckoutPage;
