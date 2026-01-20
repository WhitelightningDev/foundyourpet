import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddPetModal = ({ showModal, closeModal, refreshPets }) => {
  const navigate = useNavigate();

  const [petData, setPetData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    gender: "",
    size: "",
    spayedNeutered: false,
    photoFile: null,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setPetData((prev) => ({
        ...prev,
        photoFile: files[0] || null,
      }));
    } else {
      setPetData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));

      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!petData.name.trim()) validationErrors.name = "Pet name is required.";
    if (!petData.species) validationErrors.species = "Species is required.";
    if (!petData.breed.trim()) validationErrors.breed = "Breed is required.";
    if (!petData.age || Number(petData.age) < 0)
      validationErrors.age = "Valid age is required.";
    if (!petData.gender) validationErrors.gender = "Gender is required.";
    if (!petData.size) validationErrors.size = "Size is required.";

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      setToast({ show: true, message: "You must be logged in to add a pet.", type: "error" });
      closeModal();
      return;
    }

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.userId;

      const sizeKey = petData.size.toLowerCase();
      const monthlyPrice =
        sizeKey === "small" ? 50 : sizeKey === "medium" ? 70 : sizeKey === "large" ? 100 : null;

      if (!monthlyPrice) {
        setToast({ show: true, message: "Please select a valid pet size.", type: "error" });
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", petData.name.trim());
      formData.append("species", petData.species);
      formData.append("breed", petData.breed.trim());
      formData.append("age", petData.age);
      formData.append("gender", petData.gender);
      formData.append("size", petData.size);
      formData.append("spayedNeutered", petData.spayedNeutered);
      formData.append("userId", userId);

      if (petData.photoFile) {
        formData.append("photo", petData.photoFile);
      }

      const response = await fetch(
        "https://foundyourpet-backend.onrender.com/api/pets/create",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error adding pet:", errorData);
        setToast({ show: true, message: "An error occurred while adding the pet.", type: "error" });
        setIsLoading(false);
        return;
      }

      const result = await response.json();
      console.log("Pet added successfully:", result);
      setToast({ show: true, message: "Pet added. Redirecting to subscription checkout…", type: "success" });
      refreshPets();
      closeModal();

      const createdPet = result?.pet ?? result?.data ?? result?.newPet ?? result;
      if (!createdPet?._id) {
        setToast({
          show: true,
          message: "Pet was added, but we could not start checkout. Please try again from your dashboard.",
          type: "error",
        });
        return;
      }

      navigate("/checkout", {
        state: {
          membership: true,
          total: monthlyPrice,
          package: { type: `${petData.size} Pet Subscription` },
          membershipObjectId: null,
          selectedPets: [createdPet],
        },
      });
    } catch (error) {
      console.error("Error adding pet:", error);
      setToast({ show: true, message: "An error occurred. Please try again.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Toast auto-hide effect
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast((t) => ({ ...t, show: false })), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Reusable input component
  const renderInput = (label, name, type = "text") => (
    <div className="col-md-6 mb-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        className={`form-control ${errors[name] ? "is-invalid" : ""}`}
        value={petData[name]}
        onChange={handleInputChange}
        disabled={isLoading}
      />
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  // Reusable select component
  const renderSelect = (label, name, options) => (
    <div className="col-md-6 mb-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <select
        id={name}
        name={name}
        className={`form-select ${errors[name] ? "is-invalid" : ""}`}
        value={petData[name]}
        onChange={handleInputChange}
        disabled={isLoading}
      >
        <option value="">{`Select ${label.toLowerCase()}`}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  if (!showModal) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1040, backgroundColor: "rgba(0,0,0,0.5)" }}
      />

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        aria-labelledby="addPetModalLabel"
        aria-modal="true"
        role="dialog"
        style={{ zIndex: 1050 }}
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content shadow rounded">
            <div className="modal-header border-0">
              <h5 className="modal-title" id="addPetModalLabel">
                Add New Pet
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeModal}
                disabled={isLoading}
              />
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit} noValidate>
                <div className="row">
                  {renderInput("Pet Name", "name")}
                  {renderSelect("Species", "species", ["Dog", "Cat"])}
                  {renderInput("Breed", "breed")}
                  {renderInput("Age", "age", "number")}
                  {renderSelect("Gender", "gender", ["Male", "Female"])}
                  {renderSelect("Size", "size", ["Small", "Medium", "Large"])}

                  <div className="col-md-6 mb-3">
                    <label htmlFor="photo" className="form-label">
                      Pet Image
                    </label>
                    <input
                      id="photo"
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="col-md-6 mb-3 d-flex align-items-center">
                    <div className="form-check">
                      <input
                        id="spayedNeutered"
                        type="checkbox"
                        name="spayedNeutered"
                        className="form-check-input"
                        checked={petData.spayedNeutered}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      <label
                        htmlFor="spayedNeutered"
                        className="form-check-label ms-2"
                      >
                        Spayed / Neutered
                      </label>
                    </div>
                  </div>
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary fw-semibold d-flex justify-content-center align-items-center"
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    )}
                    Add Pet
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`toast align-items-center text-white ${
            toast.type === "success" ? "bg-success" : "bg-danger"
          } border-0 show`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          style={{
            position: "fixed",
            bottom: "1rem",
            right: "1rem",
            zIndex: 1060,
            minWidth: "250px",
          }}
        >
          <div className="d-flex">
            <div className="toast-body">{toast.message}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              aria-label="Close"
              onClick={() => setToast((t) => ({ ...t, show: false }))}
            ></button>
          </div>
        </div>
      )}
    </>
  );
};

export default AddPetModal;
