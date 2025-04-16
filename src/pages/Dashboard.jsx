/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  ListGroup,
} from "react-bootstrap";
import AddPetModal from "../components/AddPetModal";
import { FaPaw, FaDog, FaCat, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PetDetailsModal from "../components/PetDetailsModal";

function Dashboard() {
  const [user, setUser] = useState({ name: "", surname: "" });
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [currentPet, setCurrentPet] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
  });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate = useNavigate();

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
    setShowDetailsModal(true);
  };

  const handleEditClick = (pet) => {
    setCurrentPet(pet);
    setFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
    });
    setShowModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedPet(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");

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

    fetchUser();
    fetchPets();
  }, []);

  const handleOpenModal = () => {
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
      <AddPetModal showModal={showModal} closeModal={handleCloseModal} />
      {selectedPet && (
        <PetDetailsModal
          show={showDetailsModal}
          handleClose={handleCloseDetailsModal}
          pet={selectedPet}
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
