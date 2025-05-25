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
import { Placeholder } from "react-bootstrap";
import "react-loading-skeleton/dist/skeleton.css";
import PetListSection from "../components/PetListSection";
function Dashboard() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    isAdmin: false,
    membershipActive: "",
    contact: "",
    address: {
      street: "",
      city: "",
      province: "",
      postalCode: "",
      country: "",
    },
  });

  const [membershipActive, setMembershipActive] = useState(false);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [currentPet, setCurrentPet] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
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
    const message = encodeURIComponent(
      "Check out Found Your Pet — a simple, smart way to help lost pets get home faster.   https://foundyourpet.vercel.app/"
    );
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

  const handleViewDetails = async (pet) => {
    setDetailsLoading(true);
    try {
      const response = await axios.get(
        `https://foundyourpet-backend.onrender.com/api/pets/${pet._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedPet(response.data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Failed to fetch latest pet details:", error);
      toast.error("Could not load pet details.");
    } finally {
      setDetailsLoading(false);
    }
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
      setUserLoading(true);
      try {
        const response = await axios.get(
          "https://foundyourpet-backend.onrender.com/api/users/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Fetched user:", response.data.user); // Confirm user object

        const userData = response.data.user;

        setUser({
          name: userData.name?.trim() || "",
          email: userData.email || "",
          isAdmin: userData.isAdmin || false,
          membershipActive: userData.membershipActive || false,
          contact: userData.contact || "",
          address: userData.address || {
            street: "",
            city: "",
            province: "",
            postalCode: "",
            country: "",
          },
        });
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        toast.error("Failed to load user information.");
      } finally {
        setUserLoading(false);
      }
    };

    if (token) {
      fetchUser();
      fetchPets();
    }
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
        {userLoading ? (
          <Spinner animation="border" size="sm" />
        ) : (
          <h3 className="text-dark fw-bold m-0">Welcome back {user.name}</h3>
        )}

        <Button variant="outline-success" size="sm" onClick={handleShare}>
          Share on WhatsApp
        </Button>
      </div>

      <div>User Has a membership {user.membershipActive}</div>

      <div className="d-flex justify-content-center mb-4">
        {!userLoading &&
          (user.membershipActive ? (
            <p className="text-success fw-semibold">
              You have an active membership since{" "}
              {new Date(user.membershipStartDate).toLocaleDateString()}.
            </p>
          ) : (
            <p className="text-danger fw-semibold">
              You do not have an active membership.
            </p>
          ))}
      </div>

      <div className="d-flex justify-content-center mb-4">
        <Button variant="success" onClick={handleOpenModal}>
          <FaPlus className="me-2" /> Add New Pet
        </Button>
      </div>
      <PetListSection
        title="Your Dogs"
        pets={dogs}
        loading={loading}
        handleViewDetails={handleViewDetails}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
      />

      <PetListSection
        title="Your Cats"
        pets={cats}
        loading={loading}
        handleViewDetails={handleViewDetails}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
      />

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
          show={showDetailsModal}
          handleClose={handleCloseDetailsModal}
          pet={selectedPet}
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
