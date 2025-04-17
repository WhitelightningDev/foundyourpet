import React, { useState } from "react";

const AddPetModal = ({ showModal, closeModal }) => {
  const [petData, setPetData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    gender: "",
    photoUrl: "",
    spayedNeutered: false,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPetData({
      ...petData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!petData.name) newErrors.name = "Pet name is required.";
    if (!petData.species) newErrors.species = "Species is required.";
    if (!petData.breed) newErrors.breed = "Breed is required.";
    if (!petData.age || parseInt(petData.age) < 0)
      newErrors.age = "Valid age is required.";
    if (!petData.gender) newErrors.gender = "Gender is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("You must be logged in to add a pet.");
      closeModal();
      return;
    }

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.userId;

      const dataWithUserId = {
        ...petData,
        userId,
      };

      const response = await fetch(
        "https://foundyourpet-backend.onrender.com/api/pets/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataWithUserId),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Pet added successfully:", result);
        alert("Pet added successfully!");
        closeModal();
      } else {
        const errorData = await response.json();
        console.error("Error adding pet:", errorData);
        alert("An error occurred while adding the pet.");
      }
    } catch (error) {
      console.error("Error adding pet:", error);
      alert("An error occurred while adding the pet. Please try again.");
    }
  };

  const renderInput = (label, name, type = "text") => (
    <div className="col-md-6 mb-3">
      <label className="form-label">{label}</label>
      <input
        type={type}
        name={name}
        className={`form-control ${errors[name] ? "is-invalid" : ""}`}
        value={petData[name]}
        onChange={handleInputChange}
      />
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  const renderSelect = (label, name, options) => (
    <div className="col-md-6 mb-3">
      <label className="form-label">{label}</label>
      <select
        name={name}
        className={`form-control ${errors[name] ? "is-invalid" : ""}`}
        value={petData[name]}
        onChange={handleInputChange}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  return (
    <>
      {showModal && (
        <div
          className="modal-backdrop fade show"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1050,
          }}
        />
      )}

      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        tabIndex="-1"
        aria-labelledby="addPetModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content shadow-lg rounded-lg">
            <div className="modal-header border-bottom-0">
              <h5 className="modal-title" id="addPetModalLabel">
                Add New Pet
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeModal}
              />
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {renderInput("Pet Name", "name")}
                  {renderSelect("Species", "species", ["Dog", "Cat"])}
                  {renderInput("Breed", "breed")}
                  {renderInput("Age", "age", "number")}
                  {renderSelect("Gender", "gender", ["Male", "Female"])}

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Pet Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setPetData((prev) => ({
                            ...prev,
                            photoUrl: reader.result,
                          }));
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </div>

                  <div className="col-md-6 mb-3 d-flex align-items-center">
                    <label className="form-label me-3">Spayed/Neutered</label>
                    <input
                      type="checkbox"
                      name="spayedNeutered"
                      className="form-check-input"
                      checked={petData.spayedNeutered}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Add Pet
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPetModal;
