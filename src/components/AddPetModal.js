import React, { useState } from "react";
import axios from "axios";

const AddPetModal = ({ showModal, closeModal }) => {
  const [petData, setPetData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPetData({
      ...petData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("You must be logged in to add a pet.");
      closeModal();
      return;
    }

    try {
      // Decode the token to get the userId
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.userId; // Assuming your token contains userId

      // Add the userId to the pet data
      const dataWithUserId = {
        ...petData,
        userId: userId,
      };

      console.log(dataWithUserId); // Log the data to confirm

      const response = await axios.post(
        "http://localhost:5000/api/pets/create",
        dataWithUserId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Pet added successfully!");
      closeModal(); // Close the modal after successful submission
    } catch (error) {
      console.error("Error adding pet:", error);
      alert("Error adding pet. Please try again.");
    }
  };

  return (
    <>
      {/* Background overlay for dimming */}
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
            zIndex: 1050, // Ensure the backdrop appears behind the modal
          }}
        />
      )}

      {/* Modal structure */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        tabIndex="-1"
        aria-labelledby="addPetModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg rounded-lg">
            <div className="modal-header border-bottom-0">
              <h5 className="modal-title" id="addPetModalLabel">
                Add New Pet
              </h5>
              <button
                type="button"
                className="btn-close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={closeModal}
              />
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="petName" className="form-label">
                    Pet Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="petName"
                    name="name"
                    value={petData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="species" className="form-label">
                    Species
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="species"
                    name="species"
                    value={petData.species}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="breed" className="form-label">
                    Breed
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="breed"
                    name="breed"
                    value={petData.breed}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="age" className="form-label">
                    Age
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="age"
                    name="age"
                    value={petData.age}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Add Pet
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPetModal;
