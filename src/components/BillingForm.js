import React from "react";

function BillingForm({ formData, errors, handleChange, handleCheckout }) {
  return (
    <>
      <h4
        style={{
          fontWeight: 700,
          fontSize: "1.75rem",
          marginBottom: "2rem",
          color: "#111827",
          borderBottom: "2px solid #2563eb",
          paddingBottom: "0.5rem",
        }}
      >
        Billing Address
      </h4>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          maxWidth: "480px",
          margin: "0 auto",
        }}
        noValidate
        onSubmit={handleCheckout}
      >
        {[
          { id: "firstName", label: "First name", required: true, type: "text" },
          { id: "lastName", label: "Last name", required: true, type: "text" },
          { id: "email", label: "Email (Optional)", required: false, type: "email" },
          { id: "address", label: "Address", required: true, type: "text" },
          { id: "address2", label: "Address 2", required: false, type: "text" },
          {
            id: "country",
            label: "Country",
            required: true,
            type: "select",
            options: ["South Africa"],
          },
          {
            id: "province",
            label: "Province",
            required: true,
            type: "select",
            options: [
              "Gauteng",
              "Western Cape",
              "KwaZulu-Natal",
              "Eastern Cape",
              "Free State",
              "Limpopo",
              "Mpumalanga",
              "North West",
              "Northern Cape",
            ],
          },
          { id: "zip", label: "Postal Code", required: true, type: "text" },
        ].map(({ id, label, required, type, options }) => (
          <div key={id} style={{ display: "flex", flexDirection: "column" }}>
            <label
              htmlFor={id}
              style={{
                fontWeight: 600,
                marginBottom: "0.4rem",
                color: errors[id] ? "#dc2626" : "#374151",
              }}
            >
              {label}
              {required && <span style={{ color: "#ef4444" }}> *</span>}
            </label>
            {type === "select" ? (
              <select
                id={id}
                value={formData[id]}
                onChange={handleChange}
                required={required}
                style={{
                  padding: "0.75rem 1rem",
                  fontSize: "1rem",
                  borderRadius: 8,
                  border: errors[id] ? "2px solid #dc2626" : "1.5px solid #d1d5db",
                  outlineColor: "#2563eb",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                  transition: "border-color 0.3s ease",
                }}
              >
                <option value="">Choose...</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                id={id}
                value={formData[id]}
                onChange={handleChange}
                required={required}
                style={{
                  padding: "0.75rem 1rem",
                  fontSize: "1rem",
                  borderRadius: 8,
                  border: errors[id] ? "2px solid #dc2626" : "1.5px solid #d1d5db",
                  outlineColor: "#2563eb",
                  transition: "border-color 0.3s ease",
                }}
              />
            )}
            {errors[id] && (
              <small
                style={{
                  color: "#dc2626",
                  marginTop: "0.25rem",
                  fontWeight: 600,
                }}
              >
                {errors[id]}
              </small>
            )}
          </div>
        ))}

        <button
          type="submit"
          style={{
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: "1.1rem",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(37, 99, 235, 0.6)",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e40af")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
        >
          Complete Checkout
        </button>
      </form>
    </>
  );
}

export default BillingForm;
