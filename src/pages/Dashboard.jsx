import React, { useEffect, useState, useCallback } from "react";
import "../styles/Dashboard.css";
import axios from "axios";
import { Container, Button, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import AddPetModal from "../components/AddPetModal";
import EditPetModal from "../components/EditPetModal";
import PetDetailsModal from "../components/PetDetailsModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import PetListSection from "../components/PetListSection";

import "react-loading-skeleton/dist/skeleton.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const [user, setUser] = useState({
    name: "",
    email: "",
    isAdmin: false,
    membershipActive: false,
    contact: "",
    membershipStartDate: "",
    address: {
      street: "",
      city: "",
      province: "",
      postalCode: "",
      country: "",
    },
  });

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [currentPet, setCurrentPet] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://foundyourpet-backend.onrender.com/api/users/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const userData = response.data.user;

      setUser({
        name: userData.name?.trim() || "",
        email: userData.email || "",
        isAdmin: userData.isAdmin || false,
        membershipActive: userData.membershipActive || false,
        membershipStartDate: userData.membershipStartDate || "",
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
  }, [token]);

  const fetchPets = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://foundyourpet-backend.onrender.com/api/pets",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPets(response.data);
    } catch (error) {
      console.error("Failed to fetch pets:", error);
      toast.error("Could not load pets.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const refreshPets = () => fetchPets();

  const handleOpenModal = () => {
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

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
      console.error("Failed to fetch pet details:", error);
      toast.error("Could not load pet details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedPet(null);
  };

  const handleEditClick = (pet) => {
    setIsEditMode(true);
    setCurrentPet(pet);
    setFormData({
      name: pet.name || "",
      species: pet.species || "",
      breed: pet.breed || "",
      age: pet.age || "",
      gender: pet.gender || "",
      dateOfBirth: pet.dateOfBirth || "",
      photoUrl: pet.photoUrl || "",
      color: pet.color || "",
      size: pet.size || "",
      weight: pet.weight || "",
      spayedNeutered: pet.spayedNeutered?.toString() || "",
      microchipNumber: pet.microchipNumber || "",
    });
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
    try {
      const updatedData = {
        ...formData,
        spayedNeutered: formData.spayedNeutered === "true",
      };

      await axios.put(
        `https://foundyourpet-backend.onrender.com/api/pets/${currentPet._id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Pet updated successfully!");
      setShowModal(false);
      fetchPets();
    } catch (error) {
      console.error("Failed to update pet:", error);
      toast.error("Failed to update pet.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPets((prev) => prev.filter((pet) => pet._id !== petToDelete));
      toast.success("Pet deleted successfully.");
    } catch (error) {
      console.error("Error deleting pet:", error);
      toast.error("Failed to delete pet.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setPetToDelete(null);
    }
  };

  const handleShare = () => {
    const message = encodeURIComponent(
      "Check out Found Your Pet — a simple, smart way to help lost pets get home faster. https://foundyourpet.vercel.app/"
    );
    const url = `https://wa.me/?text=${message}`;
    window.open(url, "_blank");
  };

  useEffect(() => {
    if (token) {
      fetchUser();
      fetchPets();
    } else {
      navigate("/login");
    }
  }, [token, fetchUser, fetchPets, navigate]);

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

      {!isEditMode && (
        <AddPetModal
          showModal={showModal}
          closeModal={handleCloseModal}
          refreshPets={refreshPets}
        />
      )}

      {isEditMode && (
        <EditPetModal
          show={showModal}
          formData={formData}
          handleChange={handleChange}
          handleClose={handleCloseModal}
          handleSave={handleSaveChanges}
          refreshPets={refreshPets}
        />
      )}

      {showDetailsModal && selectedPet && (
        <PetDetailsModal
          show={showDetailsModal}
          handleClose={handleCloseDetailsModal}
          pet={selectedPet}
        />
      )}

      <DeleteConfirmationModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={confirmDeletePet}
        isDeleting={isDeleting}
        deletionSuccess={false}
        refreshPets={refreshPets}
      />
    </Container>
  );
};

export default Dashboard;
