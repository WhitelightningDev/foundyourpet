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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Loader2, Mail, MapPin, PawPrint, Phone } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const [user, setUser] = useState({
    _id: "",
    name: "",
    surname: "",
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
      const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = response.data.user;

      setUser({
        _id: userData._id || "",
        name: userData.name?.trim() || "",
        surname: userData.surname?.trim() || "",
        email: userData.email || "",
        isAdmin: userData.isAdmin || false,
        membershipActive: userData.membershipActive || false,
        membershipStartDate: userData.membershipStartDate ?? "",
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
      "Check out Found Your Pet — a simple, smart way to help lost pets get home faster. https://www.foundyourpet.co.za/"
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

  const normalizeUserId = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") return value._id || "";
    return "";
  };

  const visiblePets = pets.filter((pet) => {
    const currentUserId = normalizeUserId(user?._id);
    const petUserId = normalizeUserId(pet?.userId);
    if (!currentUserId) return true;
    if (!petUserId) return false;
    return petUserId === currentUserId;
  });

  const dogs = visiblePets.filter((pet) => pet.species?.toLowerCase() === "dog");
  const cats = visiblePets.filter((pet) => pet.species?.toLowerCase() === "cat");
  const subscribedPets = visiblePets.filter((pet) => pet.hasMembership);
  const canOrderTags = visiblePets.length > 0;

  const initials = (() => {
    const first = (user?.name || "").trim();
    const last = (user?.surname || "").trim();
    const a = first ? first[0] : "";
    const b = last ? last[0] : "";
    return (a + b).toUpperCase() || "U";
  })();

  const locationLine = (() => {
    const city = user?.address?.city?.trim();
    const province = user?.address?.province?.trim();
    const country = user?.address?.country?.trim();
    return [city, province, country].filter(Boolean).join(", ");
  })();

  return (
    <main className="min-h-screen bg-muted/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Manage your account and your pets in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleOpenModal} title="Add a new pet">
              <FaPlus />
              Add pet
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <FaWhatsapp />
              Share
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="space-y-4">
                {userLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="truncate text-xl">
                          {user.name} {user.surname}
                        </CardTitle>
                        {locationLine ? (
                          <CardDescription className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{locationLine}</span>
                          </CardDescription>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant={user.membershipActive ? "default" : "secondary"}>
                        {user.membershipActive ? "Membership active" : "No active membership"}
                      </Badge>
                      <Badge variant="outline">
                        Subscribed pets: {subscribedPets.length} / {visiblePets.length}
                      </Badge>
                    </div>
                  </>
                )}
              </CardHeader>

              {!userLoading ? (
                <CardContent className="space-y-4">
                  <Separator />

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate text-foreground">{user.email}</span>
                    </div>
                    {user.contact ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span className="truncate text-foreground">{user.contact}</span>
                      </div>
                    ) : null}
                    {user.membershipStartDate ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span className="truncate text-foreground">
                          Member since {String(user.membershipStartDate)}
                        </span>
                      </div>
                    ) : null}
                  </div>

                  <div className="rounded-lg border bg-background p-3">
                    <p className="text-xs font-medium text-muted-foreground">Address</p>
                    <p className="mt-1 text-sm">
                      {[user.address?.street, user.address?.city, user.address?.province]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {[user.address?.postalCode, user.address?.country].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </CardContent>
              ) : null}
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Quick actions</CardTitle>
                <CardDescription>Order tags and manage subscriptions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" onClick={() => navigate("/prices")} className="w-full">
                  View pricing
                </Button>
                <Button
                  onClick={() => navigate("/select-tag/standard")}
                  disabled={!canOrderTags}
                  className="w-full"
                >
                  Order tags (R250 each)
                </Button>

                <div className="rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2 font-medium text-foreground">
                    <PawPrint className="h-4 w-4" />
                    Add a pet before ordering tags
                  </p>
                  <p className="mt-1">
                    Tags can only be ordered for pets with an active subscription.
                  </p>
                  {!canOrderTags ? (
                    <p className="mt-2">You don&apos;t have any pets yet—add one to continue.</p>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="shadow-sm">
                <CardHeader className="space-y-1">
                  <CardDescription>Total pets</CardDescription>
                  <CardTitle className="text-3xl">{visiblePets.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="space-y-1">
                  <CardDescription>Subscribed</CardDescription>
                  <CardTitle className="text-3xl">{subscribedPets.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="space-y-1">
                  <CardDescription>Dogs</CardDescription>
                  <CardTitle className="text-3xl">{dogs.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="space-y-1">
                  <CardDescription>Cats</CardDescription>
                  <CardTitle className="text-3xl">{cats.length}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Your pets</CardTitle>
                <CardDescription>View, edit, subscribe, and order tags.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="w-full justify-start">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="dogs">Dogs</TabsTrigger>
                    <TabsTrigger value="cats">Cats</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all">
                    <PetListSection
                      title="All pets"
                      showHeader={false}
                      pets={visiblePets}
                      loading={loading}
                      user={user}
                      handleViewDetails={handleViewDetails}
                      handleEditClick={handleEditClick}
                      handleDeleteClick={handleDeleteClick}
                    />
                  </TabsContent>

                  <TabsContent value="dogs">
                    <PetListSection
                      title="Dogs"
                      showHeader={false}
                      pets={dogs}
                      loading={loading}
                      user={user}
                      handleViewDetails={handleViewDetails}
                      handleEditClick={handleEditClick}
                      handleDeleteClick={handleDeleteClick}
                    />
                  </TabsContent>

                  <TabsContent value="cats">
                    <PetListSection
                      title="Cats"
                      showHeader={false}
                      pets={cats}
                      loading={loading}
                      user={user}
                      handleViewDetails={handleViewDetails}
                      handleEditClick={handleEditClick}
                      handleDeleteClick={handleDeleteClick}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
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
    </main>
  );
};

export default Dashboard;
