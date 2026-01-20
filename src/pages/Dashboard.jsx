import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AddPetModal from "../components/AddPetModal";
import EditPetModal from "../components/EditPetModal";
import PetDetailsModal from "../components/PetDetailsModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import PetListSection from "../components/PetListSection";
import { FaWhatsapp } from "react-icons/fa";
import { API_BASE_URL } from "../config/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

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
      `${API_BASE_URL}/api/users/me`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const userData = response.data.user;
    console.log("Fetched user data:", userData);  // <-- Log entire user object here

    setUser({
      name: userData.name?.trim() || "",
      email: userData.email || "",
      isAdmin: userData.isAdmin || false,
      membershipActive: userData.membershipActive || false,
      membershipStartDate: userData.membershipStartDate || "",  // <-- check this field
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
        `${API_BASE_URL}/api/pets`,
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
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/pets/${pet._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedPet(response.data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Failed to fetch pet details:", error);
      toast.error("Could not load pet details.");
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
        `${API_BASE_URL}/api/pets/${currentPet._id}`,
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
        `${API_BASE_URL}/api/pets/${petToDelete}`,
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
  const activeMembershipCount = pets.filter((pet) => pet.hasMembership).length;
  const canOrderTags = pets.length > 0;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <Card className="shadow-sm">
        <CardHeader className="text-center">
          {userLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <CardTitle className="text-3xl">Welcome back, {user.name}</CardTitle>
              <CardDescription>
                Subscriptions are billed monthly per pet. Small: R50 • Medium: R70 • Large: R100.
              </CardDescription>
            </>
          )}
        </CardHeader>

        {!userLoading && (
          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge variant="secondary">
                Active subscriptions: {activeMembershipCount} / {pets.length}
              </Badge>
              <Badge variant="outline">Choose a tier when you add a pet</Badge>
            </div>

            <Separator />

            <div className="flex flex-col items-center justify-center gap-3">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button
                  onClick={handleOpenModal}
                  className="rounded-full px-6"
                  title="Add a new pet"
                >
                  <FaPlus />
                  Add New Pet
                </Button>

                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="rounded-full px-6"
                >
                  <FaWhatsapp />
                  Share on WhatsApp
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button variant="outline" onClick={() => navigate("/prices")}>
                  View pricing
                </Button>
                <Button
                  onClick={() => navigate("/select-tag/standard")}
                  disabled={!canOrderTags}
                >
                  Order tags (R250 each)
                </Button>
              </div>

              <div className="max-w-2xl rounded-lg border bg-muted/40 p-4 text-left text-sm text-muted-foreground">
                <p className="font-medium text-foreground">
                  Add a pet first before buying a tag.
                </p>
                <p className="mt-1">
                  Tags can only be ordered for pets with an active subscription.
                </p>
                {!canOrderTags && (
                  <p className="mt-2">
                    You don&apos;t have any pets yet—add one to continue.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="mt-5">
        <PetListSection
          title="Your Dogs"
          pets={dogs}
          loading={loading}
          user={user}
          handleViewDetails={handleViewDetails}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
        />

        <PetListSection
          title="Your Cats"
          pets={cats}
          loading={loading}
          user={user}
          handleViewDetails={handleViewDetails}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
        />
      </div>

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
    </div>
  );
};

export default Dashboard;
