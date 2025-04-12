/* eslint-disable no-unused-vars */
/* eslint-disable no-lone-blocks */
import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import axios from "axios";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import AddPetModal from "../components/AddPetModal";
import { FaPaw, FaDog, FaCat } from "react-icons/fa"; // Icons for species
import { useNavigate } from "react-router-dom";
import PetDetailsModal from "../components/PetDetailsModal";

function Dashboard() {
  const [user, setUser] = useState({ name: "", surname: "" });
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const navigate = useNavigate();
  const [selectedPet, setSelectedPet] = useState(null);
const [showDetailsModal, setShowDetailsModal] = useState(false);

  const renderField = (label, value) => (
    <p className="d-flex justify-content-between">
      <span className="label">{label}:</span>
      <span className={value ? "" : "value-muted"}>{value || "Not provided"}</span>
    </p>
  );

  const handleViewDetails = (pet) => {
    setSelectedPet(pet);
    setShowDetailsModal(true);
  };
  
  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedPet(null);
  };
  

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
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
        const response = await axios.get("http://localhost:5000/api/pets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPets(response.data); // Store pets in state
      } catch (error) {
        console.error("Failed to fetch pets:", error);
      } finally {
        setLoading(false); // Set loading state to false once data is fetched
      }
    };

    fetchUser();
    fetchPets();
  }, []); // Fetch user info and pets once when the component loads

  const handleOpenModal = () => {
    setShowModal(true); // Show the modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  const getSpeciesIcon = (species) => {
    switch (species.toLowerCase()) {
      case "dog":
        return <FaDog />;
      case "cat":
        return <FaCat />;
      default:
        return <FaPaw />;
    }
  };

  // Filter pets by species
  const dogs = pets.filter((pet) => pet.species.toLowerCase() === "dog");
  const cats = pets.filter((pet) => pet.species.toLowerCase() === "cat");

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center text-dark font-weight-bold">
        Welcome back, {user.name} {user.surname}!
      </h2>

      <Row className="g-4 mb-5 justify-content-center">
        <Col md={5}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title className="fw-bold">Add a Pet</Card.Title>
              <Card.Text className="text-muted">
                Use this section to register a new pet.
              </Card.Text>
              <Button
                variant="primary"
                onClick={handleOpenModal}
                className="w-100"
              >
                Add New Pet
              </Button>
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
      </Row>

      <h4 className="mb-4 text-center">Upgrade to get a Tag</h4>

      <Row className="g-4 mb-5 text-center">
        {/* Standard Tag */}
        <Col md={7}>
          <Card className="shadow-sm h-100 border-primary">
            <Card.Body>
              <Card.Title className="text-primary fw-bold">
                Standard Tag
              </Card.Title>
              <Card.Text className="text-muted">
                Classic, durable tag engraved with a QR code that links to your
                pet’s full profile.
              </Card.Text>
              <ul className="list-unstyled text-start small mb-3">
                <li>✔️ QR code & Unique ID</li>
                <li>✔️ Emergency contact info</li>
                <li>✔️ Medical profile access</li>
              </ul>
              <Button
                variant="primary"
                className="w-100"
                onClick={() => navigate("/select-tag/standard")}
              >
                Continue with Standard
              </Button>{" "}
            </Card.Body>
          </Card>
        </Col>

           {/* Standard Tag */}
           <Col md={5}>
          <Card className="shadow-sm h-100 border-primary">
            <Card.Body>
              <Card.Title className="text-primary fw-bold">
                Gps Tracking Tags
              </Card.Title>
              <Card.Text className="text-muted">
                Gps Tracking tags are coming soon!
              </Card.Text>
              <ul className="list-unstyled text-center text-start small mb-3">
                <li>✔️ QR code & Unique ID</li>
                <li>✔️ Emergency contact info</li>
                <li>✔️ Medical profile access</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      

      {/* Dogs Section */}
<h4 className="mb-4">Your Dogs</h4>
<Row>
  {loading ? (
    <Col className="text-center">
      <Spinner animation="border" variant="primary" />
      <p className="text-muted mt-2">Loading your pets...</p>
    </Col>
  ) : dogs.length > 0 ? (
    dogs.map((pet, index) => (
      <Col md={5} key={index} className="mb-4">
        <Card className="shadow-sm h-100">
        <Card.Body>
  <Card.Title className="fw-bold text-center mb-3 fs-4">{pet.name}</Card.Title>
  <Row className="mb-2">
    <Col md={6}>{renderField("Species", pet.species)}</Col>
    <Col md={6}>{renderField("Breed", pet.breed)}</Col>
    <Col md={6}>{renderField("Age", pet.age)}</Col>
  </Row>

  <Button
    variant="info"
    className="w-100 mt-3"
    onClick={() => handleViewDetails(pet)}
  >
    View Details
  </Button>
</Card.Body>

        </Card>
      </Col>
    ))
  ) : (
    <Col>
      <p className="text-muted text-center">You don't have any dogs.</p>
    </Col>
  )}
</Row>


      {/* Cats Section */}
      <h4 className="mb-4">Your Cats</h4>
      <Row>
  {loading ? (
    <Col className="text-center">
      <Spinner animation="border" variant="primary" />
      <p className="text-muted mt-2">Loading your pets...</p>
    </Col>
  ) : cats.length > 0 ? (
    cats.map((pet, index) => (
      <Col md={5} key={index} className="mb-4">
        <Card className="shadow-sm h-100">
        <Card.Body>
  <Card.Title className="fw-bold text-center mb-3 fs-4">{pet.name}</Card.Title>
  <Row className="mb-2">
    <Col md={6}>{renderField("Species", pet.species)}</Col>
    <Col md={6}>{renderField("Breed", pet.breed)}</Col>
    <Col md={6}>{renderField("Age", pet.age)}</Col>
  </Row>

  <Button
    variant="info"
    className="w-100 mt-3"
    onClick={() => handleViewDetails(pet)}
  >
    View Details
  </Button>
</Card.Body>

        </Card>
      </Col>
    ))
  ) : (
    <Col>
      <p className="text-muted text-center">You don't have any cats.</p>
    </Col>
  )}
</Row>


      {/* Add Pet Modal */}
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
