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
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PetDetailsModal from "../components/PetDetailsModal";

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

  const token = localStorage.getItem("authToken");

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

  const handleDeletePet = async (petId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this pet?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://foundyourpet-backend.onrender.com/api/pets/${petId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      setPets((prevPets) => prevPets.filter((pet) => pet._id !== petId));
      toast.success("Pet deleted successfully");
    } catch (error) {
      console.error(
        "Error deleting pet:",
        error.response?.data || error.message
      );
      toast.error("Failed to delete pet");
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
      dateOfBirth: pet.dateOfBirth ? pet.dateOfBirth.substring(0, 10) : "",
      photoUrl: pet.photoUrl || "",
      color: pet.color || "",
      size: pet.size || "",
      weight: pet.weight || "",
      spayedNeutered: pet.spayedNeutered ? "true" : "false",
      microchipNumber: pet.microchipNumber || "",
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
      <h2 className="mb-4 text-center text-dark fw-bold">
        Welcome back, {user.name} {user.surname}!
      </h2>

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
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{pet.name}</strong> – {pet.breed}
              </div>
              <div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleViewDetails(pet)}
                >
                  <FaEdit /> View Details
                </Button>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditClick(pet)}
                >
                  <FaEdit /> Edit
                </Button>

                <Button
                  variant="outline-danger"
                  size="sm"
                  className="me-2"
                  onClick={() => handleDeletePet(pet._id)}
                >
                  <FaTrash /> Delete
                </Button>
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={() => navigate("/select-tag/standard")}
                >
                  Order Tags
                </Button>
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
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{pet.name}</strong> – {pet.breed}
              </div>
              <div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleViewDetails(pet)}
                >
                  <FaEdit /> View Details
                </Button>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditClick(pet)}
                >
                  <FaEdit /> Edit
                </Button>

                <Button
                  variant="outline-danger"
                  size="sm"
                  className="me-2"
                  onClick={() => handleDeletePet(pet._id)}
                >
                  <FaTrash /> Delete
                </Button>
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={() => navigate("/select-tag/standard")}
                >
                  Order Tags
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p className="text-muted">You don't have any cats.</p>
      )}

      {/* Modals */}
      {!isEditMode && (
        <AddPetModal showModal={showModal} closeModal={handleCloseModal} />
      )}

      {isEditMode && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Edit Pet</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {/* Form fields */}
              <Form.Group controlId="petName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="petSpecies">
                <Form.Label>Species</Form.Label>
                <Form.Control
                  type="text"
                  name="species"
                  value={formData.species}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="petBreed">
                <Form.Label>Breed</Form.Label>
                <Form.Control
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="petAge">
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="petSpayedNeutered">
                <Form.Label>Spayed/Neutered</Form.Label>
                <Form.Control
                  as="select"
                  name="spayedNeutered"
                  value={formData.spayedNeutered}
                  onChange={handleChange}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="petMicrochipNumber">
                <Form.Label>Microchip Number</Form.Label>
                <Form.Control
                  type="text"
                  name="microchipNumber"
                  value={formData.microchipNumber}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {showDetailsModal && (
        <PetDetailsModal
        pet={selectedPet}
        show={showDetailsModal}
        handleClose={handleCloseDetailsModal}
      />
      
      )}
    </Container>
  );
}

export default Dashboard;





{
  /* <Row className="g-4 mb-5 justify-content-center">
        <Col md={5}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title className="fw-bold">Add a Pet</Card.Title>
              <Card.Text className="text-muted">
                Use this section to register a new pet.
              </Card.Text>
              
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title className="fw-bold">Manage Existing Pets</Card.Title>
              <Card.Text className="text-muted">
                View or modify your registered pets' information.
              </Card.Text>
              <Button
                variant="secondary"
                className="w-100"
                onClick={() => navigate("/manage-pets")}
              >
                Manage Pets
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row> */
}

{
  /* Samsung Smart Tag */
}
{
  /* <Col md={4}>
    <Card className="shadow-sm h-100 border-success">
      <Card.Body>
        <Card.Title className="text-success fw-bold">Samsung Smart Tag</Card.Title>
        <Card.Text className="text-muted">
          Leverage Samsung’s ecosystem for live GPS tracking with your mobile device.
        </Card.Text>
        <ul className="list-unstyled text-start small mb-3">
          <li>📍 Real-time tracking</li>
          <li>🔗 Samsung SmartThings support</li>
          <li>✔️ Long battery life</li>
        </ul>
        <Button variant="outline-success" className="mb-2 w-100">Add Accessories</Button>
        <Button variant="success" className="w-100" onClick={() => navigate("/select-tag/samsung")}>Continue with Samsung Tag</Button>      </Card.Body>
    </Card>
  </Col> */
}

{
  /* Apple AirTag */
}
{
  /* <Col md={4}>
    <Card className="shadow-sm h-100 border-dark">
      <Card.Body>
        <Card.Title className="text-dark fw-bold">Apple AirTag</Card.Title>
        <Card.Text className="text-muted">
          Track your pet in real time using Apple’s Find My network with precision and ease.
        </Card.Text>
        <ul className="list-unstyled text-start small mb-3">
          <li>📱 iOS & Find My integration</li>
          <li>🧭 Ultra-wideband precision</li>
          <li>🎽 Optional tag holders</li>
        </ul>
        <Button variant="outline-dark" className="mb-2 w-100">Select AirTag Holder</Button>
        <Button variant="dark" className="w-100" onClick={() => navigate("/select-tag/apple")}>Continue with Apple AirTag</Button>      </Card.Body>
    </Card>
  </Col> */
}
