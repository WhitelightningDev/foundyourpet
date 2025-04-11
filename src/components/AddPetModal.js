import React, { useState } from "react";

const AddPetModal = ({ showModal, closeModal }) => {
  const [petData, setPetData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    gender: "",
    dateOfBirth: "",
    photoUrl: "",
    color: "",
    size: "",
    weight: "",
    spayedNeutered: false,
    microchipNumber: "",
    vaccinations: [],
    allergies: [],
    medicalConditions: [],
    medications: [],
    tagType: "",
    engravingInfo: "",
    tagSerial: "",
    adoptionDate: "",
    trainingLevel: "",
    personality: "",
    dietaryPreferences: "",
    vetInfo: "",
    insuranceInfo: "",
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
                {/* Gender Dropdown */}
                <div className="form-group mb-3">
                  <label htmlFor="gender">Gender</label>
                  <select
                    className="form-control"
                    name="gender"
                    value={petData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div className="form-group mb-3">
                  <label htmlFor="dateOfBirth">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dateOfBirth"
                    value={petData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Photo URL */}
                <div className="form-group mb-3">
                  <label htmlFor="photoUrl">Photo URL</label>
                  <input
                    type="url"
                    className="form-control"
                    name="photoUrl"
                    value={petData.photoUrl}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Appearance */}
                <div className="form-group mb-3">
                  <label htmlFor="color">Color</label>
                  <input
                    type="text"
                    className="form-control"
                    name="color"
                    value={petData.color}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="size">Size</label>
                  <input
                    type="text"
                    className="form-control"
                    name="size"
                    value={petData.size}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="weight">Weight (kg)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="weight"
                    value={petData.weight}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Spayed/Neutered */}
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="spayedNeutered"
                    name="spayedNeutered"
                    checked={petData.spayedNeutered}
                    onChange={(e) =>
                      setPetData({
                        ...petData,
                        spayedNeutered: e.target.checked,
                      })
                    }
                  />
                  <label className="form-check-label" htmlFor="spayedNeutered">
                    Spayed/Neutered
                  </label>
                </div>

                {/* Microchip */}
                <div className="form-group mb-3">
                  <label htmlFor="microchipNumber">Microchip Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="microchipNumber"
                    value={petData.microchipNumber}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Vaccinations, Allergies, etc. as comma-separated */}
                {[
                  "vaccinations",
                  "allergies",
                  "medicalConditions",
                  "medications",
                ].map((field) => (
                  <div key={field} className="form-group mb-3">
                    <label htmlFor={field}>
                      {field.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name={field}
                      placeholder="Comma-separated values"
                      value={petData[field].join(", ")}
                      onChange={(e) =>
                        setPetData({
                          ...petData,
                          [field]: e.target.value
                            .split(",")
                            .map((v) => v.trim()),
                        })
                      }
                    />
                  </div>
                ))}

                {/* Tag Info */}
                <div className="form-group mb-3">
                  <label htmlFor="tagType">Tag Type</label>
                  <select
                    className="form-control"
                    name="tagType"
                    value={petData.tagType}
                    onChange={handleInputChange}
                  >
                    <option value="">Select tag type</option>
                    <option value="standard">Standard Tag</option>
                    <option value="apple">Apple AirTag</option>
                    <option value="samsung">Samsung SmartTag</option>
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="engravingInfo">Engraving Info</label>
                  <input
                    type="text"
                    className="form-control"
                    name="engravingInfo"
                    value={petData.engravingInfo}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="tagSerial">Tag Serial</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tagSerial"
                    value={petData.tagSerial}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Adoption and Training */}
                <div className="form-group mb-3">
                  <label htmlFor="adoptionDate">Adoption Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="adoptionDate"
                    value={petData.adoptionDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="trainingLevel">Training Level</label>
                  <input
                    type="text"
                    className="form-control"
                    name="trainingLevel"
                    value={petData.trainingLevel}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Personality and Diet */}
                <div className="form-group mb-3">
                  <label htmlFor="personality">Personality</label>
                  <input
                    type="text"
                    className="form-control"
                    name="personality"
                    value={petData.personality}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="dietaryPreferences">
                    Dietary Preferences
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="dietaryPreferences"
                    value={petData.dietaryPreferences}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Vet & Insurance Info */}
                <div className="form-group mb-3">
                  <label htmlFor="vetInfo">Vet Info</label>
                  <textarea
                    className="form-control"
                    name="vetInfo"
                    value={petData.vetInfo}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="insuranceInfo">Insurance Info</label>
                  <textarea
                    className="form-control"
                    name="insuranceInfo"
                    value={petData.insuranceInfo}
                    onChange={handleInputChange}
                  ></textarea>
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
