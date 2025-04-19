/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-lone-blocks */
import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import axios from "axios";
import {
  Container,
  Button,
  Modal,
  Spinner,
  Form,
  ListGroup,
} from "react-bootstrap";
import AddPetModal from "../components/AddPetModal";
import { FaPlus, FaEdit, FaTrash, FaEye, FaCartPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PetDetailsModal from "../components/PetDetailsModal";
import EditPetModal from "../components/EditPetModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

function Dashboard() {
  const [user, setUser] = useState({ name: "", surname: "" });
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [currentPet, setCurrentPet] = useState(null);
  const [formData, setFormData] = useState({
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
    spayedNeutered: "",
    microchipNumber: "",
  });

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  const [deletionSuccess, setDeletionSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleShare = () => {
    const message = encodeURIComponent("Check out Found Your Pet — a simple, smart way to help lost pets get home faster.   https://foundyourpet.co.za");
    const url = `https://wa.me/?text=${message}`;
    window.open(url, "_blank");
  };
  
  const token = localStorage.getItem("authToken");

  // Inside Dashboard component

const refreshPets = () => {
  fetchPets();
};


  const fetchPets = async () => {
    try {
      const response = await axios.get(
        "https://foundyourpet-backend.onrender.com/api/pets",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPets(response.data);
    } catch (error) {
      console.error("Failed to fetch pets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (petId) => {
    setPetToDelete(petId);
    setShowDeleteModal(true);
  };

  const confirmDeletePet = async () => {
    if (!petToDelete) return;
    setIsDeleting(true);

    try {
      await axios.delete(
        `https://foundyourpet-backend.onrender.com/api/pets/${petToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      setPets((prevPets) => prevPets.filter((pet) => pet._id !== petToDelete));
      toast.success("Pet deleted successfully");
    } catch (error) {
      console.error(
        "Error deleting pet:",
        error.response?.data || error.message
      );
      toast.error("Failed to delete pet");
    } finally {
      setShowDeleteModal(false);
      setIsDeleting(false);
      setPetToDelete(null);
    }
  };

  const handleViewDetails = (pet) => {
    setSelectedPet(pet);
    setShowDetailsModal(true); // Show details modal
  };

  const handleEditClick = (pet) => {
    setIsEditMode(true); // Edit mode
    setCurrentPet(pet);
    setFormData({
      name: pet.name || "",
      species: pet.species || "",
      breed: pet.breed || "",
      age: pet.age || "",
      gender: pet.gender || "",
      photoUrl: pet.photoUrl || "",
      color: pet.color || "",
      size: pet.size || "",
    });
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
    try {
      const updatedData = {
        ...formData,
        spayedNeutered: formData.spayedNeutered === "true", // Ensure conversion to boolean
      };
      console.log("Updated Pet Data: ", updatedData); // Debugging log

      await axios.put(
        `https://foundyourpet-backend.onrender.com/api/pets/${currentPet._id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Pet updated successfully!");
      setShowModal(false);
      fetchPets(); // Refresh pets
    } catch (error) {
      console.error("Failed to update pet:", error);
      toast.error("Failed to update pet.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedPet(null); // Clear selected pet
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "https://foundyourpet-backend.onrender.com/api/users/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser({
          name: response.data.name,
          surname: response.data.surname,
        });
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    fetchUser();
    fetchPets();
  }, [token]);

  const handleOpenModal = () => {
    setIsEditMode(false); // Add mode
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const dogs = pets.filter((pet) => pet.species?.toLowerCase() === "dog");
  const cats = pets.filter((pet) => pet.species?.toLowerCase() === "cat");

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
  <h3 className="text-dark fw-bold m-0">
    Welcome back, {user.name} {user.surname}!
  </h3>
  <Button variant="outline-success" size="sm" onClick={handleShare}>
    Share on WhatsApp
  </Button>
</div>


      <div className="d-flex justify-content-center mb-4">
        <Button variant="success" onClick={handleOpenModal}>
          <FaPlus className="me-2" /> Add New Pet
        </Button>
      </div>

      {/* Dogs Section */}
      <h4 className="mb-3 text-primary">Your Dogs</h4>
      {loading ? (
        <div className="text-center mb-4">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-2">Loading your pets...</p>
        </div>
      ) : dogs.length > 0 ? (
        <ListGroup className="mb-5">
          {dogs.map((pet) => (
           <ListGroup.Item
           key={pet._id}
           className="mb-3 shadow-sm rounded p-3 bg-light"
         >
           <div className="d-flex justify-content-between align-items-center gap-3">
             {/* Pet Image */}
             {pet.photoUrl ? (
               <img
               src={pet.photoUrl.startsWith("http") ? pet.photoUrl : `https://foundyourpet-backend.onrender.com${pet.photoUrl}`}
               alt={`${pet.name}'s profile`}
               style={{
                 width: "50px",
                 height: "50px",
                 objectFit: "cover",
                 borderRadius: "50%",
               }}
             />
             
             ) : (
               <div
                 style={{
                   width: "50px",
                   height: "50px",
                   borderRadius: "50%",
                   backgroundColor: "#ccc",
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "center",
                   fontSize: "0.7rem",
                   color: "#666",
                 }}
               >
                 No Photo
               </div>
             )}
     
             {/* Pet Info */}
             <div className="flex-grow-1">
               <h5 className="mb-1">{pet.name}</h5>
               <p className="mb-0 text-muted">{pet.breed}</p>
             </div>
     
             {/* Buttons */}
             <div className="pet-button-group d-flex flex-wrap gap-1">
               <Button variant="info" size="sm" onClick={() => handleViewDetails(pet)}>
                 <FaEye className="me-1" /> View
               </Button>
               <Button variant="primary" size="sm" onClick={() => handleEditClick(pet)}>
                 <FaEdit className="me-1" /> Edit
               </Button>
               <Button variant="danger" size="sm" onClick={() => handleDeleteClick(pet._id)}>
                 <FaTrash className="me-1" /> Delete
               </Button>
               <Button variant="success" size="sm" onClick={() => navigate("/select-tag/standard")}>
                 <FaCartPlus className="me-1" /> Order Tag
               </Button>
             </div>
           </div>
         </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p className="text-muted">You don't have any dogs.</p>
      )}

      {/* Cats Section */}
      <h4 className="mb-3 text-primary">Your Cats</h4>
      {loading ? (
        <div className="text-center mb-4">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-2">Loading your pets...</p>
        </div>
      ) : cats.length > 0 ? (
        <ListGroup className="mb-5">
          {cats.map((pet) => (
            <ListGroup.Item
            key={pet._id}
            className="mb-3 shadow-sm rounded p-3 bg-light"
          >
            <div className="d-flex justify-content-between align-items-center gap-3">
              {/* Pet Image */}
              {pet.photoUrl ? (
                <img
                src={pet.photoUrl.startsWith("http") ? pet.photoUrl : `https://foundyourpet-backend.onrender.com${pet.photoUrl}`}
                alt={`${pet.name}'s profile`}
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
              
              ) : (
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    backgroundColor: "#ccc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    color: "#666",
                  }}
                >
                  No Photo
                </div>
              )}
      
              {/* Pet Info */}
              <div className="flex-grow-1">
                <h5 className="mb-1">{pet.name}</h5>
                <p className="mb-0 text-muted">{pet.breed}</p>
              </div>
      
              {/* Buttons */}
              <div className="pet-button-group d-flex flex-wrap gap-1">
                <Button variant="info" size="sm" onClick={() => handleViewDetails(pet)}>
                  <FaEye className="me-1" /> View
                </Button>
                <Button variant="primary" size="sm" onClick={() => handleEditClick(pet)}>
                  <FaEdit className="me-1" /> Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDeleteClick(pet._id)}>
                  <FaTrash className="me-1" /> Delete
                </Button>
                <Button variant="success" size="sm" onClick={() => navigate("/select-tag/standard")}>
                  <FaCartPlus className="me-1" /> Order Tag
                </Button>
              </div>
            </div>
          </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p className="text-muted">You don't have any cats.</p>
      )}

      {/* Modals */}
      {!isEditMode && (
  <AddPetModal
    showModal={showModal}
    closeModal={handleCloseModal}
    refreshPets={refreshPets} // ✅ add this
  />
)}


      {/* Edit Pet Modal */}
      {isEditMode && (
        <EditPetModal
          show={showModal}
          formData={formData}
          handleChange={handleChange}
          handleClose={handleCloseModal}
          handleSave={handleSaveChanges}
          refreshPets={refreshPets} // Pass the refresh function
        />
      )}

      {showDetailsModal && (
        <PetDetailsModal
          pet={selectedPet}
          show={showDetailsModal}
          handleClose={handleCloseDetailsModal}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={confirmDeletePet}
        isDeleting={isDeleting}
        deletionSuccess={deletionSuccess}
        refreshPets={refreshPets} // Pass the refresh function
      />
    </Container>
  );
}

export default Dashboard;
