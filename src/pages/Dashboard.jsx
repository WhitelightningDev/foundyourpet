import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import axios from "axios";
import { Container, Row, Col, Card, Button, ListGroup, Spinner } from "react-bootstrap";
import AddPetModal from "../components/AddPetModal";

function Dashboard() {
  const [user, setUser] = useState({ name: "", surname: "" });
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);  // Add loading state
  const [showModal, setShowModal] = useState(false); // Modal visibility state

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
        setPets(response.data);  // Store pets in state
      } catch (error) {
        console.error("Failed to fetch pets:", error);
      } finally {
        setLoading(false); // Set loading state to false once data is fetched
      }
    };

    fetchUser();
    fetchPets();
  }, []);  // Fetch user info and pets once when the component loads

  const handleOpenModal = () => {
    setShowModal(true); // Show the modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center text-dark font-weight-bold">Welcome back, {user.name} {user.surname}!</h2>

      <Row className="g-4 mb-5">
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title className="font-weight-bold">Add a Pet</Card.Title>
              <Card.Text className="text-muted">
                Use this section to register a new pet.
              </Card.Text>
              <Button variant="primary" onClick={handleOpenModal} className="w-100">Add New Pet</Button> {/* Open modal */}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title className="font-weight-bold">Manage Existing Pets</Card.Title>
              <Card.Text className="text-muted">
                View or modify your registered pets' information.
              </Card.Text>
              <Button variant="secondary" className="w-100">Manage Pets</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h4 className="mb-4">Your Pets</h4>
      <Row>
        {loading ? (
          <Col className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-2">Loading your pets...</p>
          </Col>
        ) : pets.length > 0 ? (
          pets.map((pet, index) => (
            <Col md={4} key={index} className="mb-4">
              <Card className="shadow-sm hover-effect">
                <Card.Body>
                  <Card.Title className="font-weight-bold">{pet.name}</Card.Title>
                  <ListGroup variant="flush">
                    <ListGroup.Item><strong>Species:</strong> {pet.species}</ListGroup.Item>
                    <ListGroup.Item><strong>Breed:</strong> {pet.breed}</ListGroup.Item>
                    <ListGroup.Item><strong>Age:</strong> {pet.age}</ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p className="text-muted text-center">No pets registered yet.</p>
          </Col>
        )}
      </Row>

      {/* Add Pet Modal */}
      <AddPetModal showModal={showModal} closeModal={handleCloseModal} />
    </Container>
  );
}

export default Dashboard;
