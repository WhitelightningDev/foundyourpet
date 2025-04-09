import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import axios from "axios";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";

function Dashboard() {
  const [user, setUser] = useState({ name: "", surname: "" });
  const [pets, setPets] = useState([]);

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
        setPets(response.data);
      } catch (error) {
        console.error("Failed to fetch pets:", error);
      }
    };

    fetchUser();
    fetchPets();
  }, []);

  return (
    <Container className="my-5">
      <h2 className="mb-4">Welcome back, {user.name} {user.surname}!</h2>

      <Row className="g-4 mb-5">
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>Add a Pet</Card.Title>
              <Card.Text>
                Use this section to register a new pet.
              </Card.Text>
              <Button variant="primary">Add New Pet</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>Edit Existing Pets</Card.Title>
              <Card.Text>
                View or modify your registered pets' information.
              </Card.Text>
              <Button variant="secondary">Manage Pets</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h4 className="mb-3">Your Pets</h4>
      <Row>
        {pets.length > 0 ? (
          pets.map((pet, index) => (
            <Col md={4} key={index} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>{pet.name}</Card.Title>
                  <ListGroup variant="flush">
                    <ListGroup.Item><strong>Type:</strong> {pet.type}</ListGroup.Item>
                    <ListGroup.Item><strong>Age:</strong> {pet.age}</ListGroup.Item>
                    <ListGroup.Item><strong>Status:</strong> {pet.status}</ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p className="text-muted">No pets registered yet.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default Dashboard;
