/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { FaPaw, FaDog, FaCat } from "react-icons/fa";

function ManagePets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPet, setCurrentPet] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
  });

  const token = localStorage.getItem("authToken");

  const fetchPets = async () => {
    try {
      const response = await axios.get("https://foundyourpet-backend.onrender.com/api/pets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPets(response.data);
    } catch (error) {
      console.error("Failed to fetch pets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/pets/${currentPet._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowModal(false);
      fetchPets(); // Refresh the list after update
    } catch (error) {
      console.error("Failed to update pet:", error);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center text-dark">Manage Your Pets</h2>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-2">Loading pets...</p>
        </div>
      ) : pets.length === 0 ? (
        <p className="text-center text-muted">No pets found.</p>
      ) : (
        <Row>
          {pets.map((pet, index) => (
            <Col md={4} key={index} className="mb-4">
              <Card className="shadow-sm h-100">
                {pet.photoUrl && (
                  <Card.Img
                    variant="top"
                    src={pet.photoUrl}
                    alt={`${pet.name}'s photo`}
                    style={{ objectFit: "cover", height: "200px" }}
                  />
                )}
                <Card.Body>
                  <Card.Title className="text-center">{pet.name}</Card.Title>
                  <div className="d-flex align-items-center mb-3">
                    <div className="me-3 fs-3 text-primary">
                      {getSpeciesIcon(pet.species)}
                    </div>
                    <div>
                      <p className="mb-1">
                        <strong>Species:</strong> {pet.species}
                      </p>
                      <p className="mb-1">
                        <strong>Breed:</strong> {pet.breed}
                      </p>
                      <p className="mb-1">
                        <strong>Gender:</strong> {pet.gender}
                      </p>
                      <p className="mb-1">
                        <strong>Age:</strong> {pet.age}
                      </p>
                      {pet.dateOfBirth && (
                        <p className="mb-1">
                          <strong>DOB:</strong>{" "}
                          {new Date(pet.dateOfBirth).toLocaleDateString()}
                        </p>
                      )}
                      {pet.color && (
                        <p className="mb-1">
                          <strong>Color:</strong> {pet.color}
                        </p>
                      )}
                      {pet.size && (
                        <p className="mb-1">
                          <strong>Size:</strong> {pet.size}
                        </p>
                      )}
                      {pet.weight && (
                        <p className="mb-1">
                          <strong>Weight:</strong> {pet.weight} kg
                        </p>
                      )}
                      <p className="mb-1">
                        <strong>Spayed/Neutered:</strong>{" "}
                        {pet.spayedNeutered ? "Yes" : "No"}
                      </p>
                      {pet.microchipNumber && (
                        <p className="mb-1">
                          <strong>Microchip #:</strong> {pet.microchipNumber}
                        </p>
                      )}
                      {pet.vaccinations?.length > 0 && (
                        <p className="mb-1">
                          <strong>Vaccinations:</strong>{" "}
                          {pet.vaccinations.join(", ")}
                        </p>
                      )}
                      {pet.allergies?.length > 0 && (
                        <p className="mb-1">
                          <strong>Allergies:</strong> {pet.allergies.join(", ")}
                        </p>
                      )}
                      {pet.medicalConditions?.length > 0 && (
                        <p className="mb-1">
                          <strong>Medical Conditions:</strong>{" "}
                          {pet.medicalConditions.join(", ")}
                        </p>
                      )}
                      {pet.medications?.length > 0 && (
                        <p className="mb-1">
                          <strong>Medications:</strong>{" "}
                          {pet.medications.join(", ")}
                        </p>
                      )}
                      {pet.tagType && (
                        <p className="mb-1">
                          <strong>Tag Type:</strong> {pet.tagType}
                        </p>
                      )}
                      {pet.tagSerial && (
                        <p className="mb-1">
                          <strong>Tag Serial:</strong> {pet.tagSerial}
                        </p>
                      )}
                      {pet.engravingInfo && (
                        <p className="mb-1">
                          <strong>Engraving:</strong> {pet.engravingInfo}
                        </p>
                      )}
                      {pet.adoptionDate && (
                        <p className="mb-1">
                          <strong>Adoption Date:</strong>{" "}
                          {new Date(pet.adoptionDate).toLocaleDateString()}
                        </p>
                      )}
                      {pet.trainingLevel && (
                        <p className="mb-1">
                          <strong>Training:</strong> {pet.trainingLevel}
                        </p>
                      )}
                      {pet.personality && (
                        <p className="mb-1">
                          <strong>Personality:</strong> {pet.personality}
                        </p>
                      )}
                      {pet.dietaryPreferences && (
                        <p className="mb-1">
                          <strong>Diet:</strong> {pet.dietaryPreferences}
                        </p>
                      )}
                      {pet.vetInfo && (
                        <p className="mb-1">
                          <strong>Vet Info:</strong> {pet.vetInfo}
                        </p>
                      )}
                      {pet.insuranceInfo && (
                        <p className="mb-1">
                          <strong>Insurance:</strong> {pet.insuranceInfo}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="info"
                    className="w-100"
                    onClick={() => handleEditClick(pet)}
                  >
                    Edit Pet
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Edit Modal */}
    <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Edit Pet Details</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Pet Name</Form.Label>
            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Species</Form.Label>
            <Form.Select name="species" value={formData.species} onChange={handleChange}>
              <option value="">Select species</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Breed</Form.Label>
            <Form.Control type="text" name="breed" value={formData.breed} onChange={handleChange} />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Age</Form.Label>
            <Form.Control type="number" name="age" value={formData.age} onChange={handleChange} />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Gender</Form.Label>
            <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control type="date" name="dateOfBirth" value={formData.dateOfBirth || ""} onChange={handleChange} />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Photo URL</Form.Label>
            <Form.Control type="text" name="photoUrl" value={formData.photoUrl || ""} onChange={handleChange} />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Color</Form.Label>
            <Form.Control type="text" name="color" value={formData.color || ""} onChange={handleChange} />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Size</Form.Label>
            <Form.Select name="size" value={formData.size || ""} onChange={handleChange}>
              <option value="">Select size</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Weight (kg)</Form.Label>
            <Form.Control type="number" name="weight" value={formData.weight || ""} onChange={handleChange} />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Spayed / Neutered</Form.Label>
            <Form.Select name="spayedNeutered" value={formData.spayedNeutered} onChange={handleChange}>
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Microchip Number</Form.Label>
            <Form.Control type="text" name="microchipNumber" value={formData.microchipNumber || ""} onChange={handleChange} />
          </Form.Group>
        </Col>
      </Row>

      {/* Textareas */}
      {[
        { label: "Vaccinations", key: "vaccinations" },
        { label: "Allergies", key: "allergies" },
        { label: "Medical Conditions", key: "medicalConditions" },
        { label: "Medications", key: "medications" },
        { label: "Engraving Info", key: "engravingInfo" },
        { label: "Dietary Preferences", key: "dietaryPreferences" },
        { label: "Vet Info", key: "vetInfo" },
        { label: "Insurance Info", key: "insuranceInfo" }
      ].map((field) => (
        <Form.Group className="mb-3" key={field.key}>
          <Form.Label>{field.label}</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            name={field.key}
            value={formData[field.key]?.join?.(", ") || formData[field.key] || ""}
            onChange={handleChange}
          />
        </Form.Group>
      ))}

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Tag Type</Form.Label>
            <Form.Select name="tagType" value={formData.tagType || ""} onChange={handleChange}>
              <option value="">Select Tag Type</option>
              <option value="Standard">Standard</option>
              <option value="Apple AirTag">Apple AirTag</option>
              <option value="Samsung SmartTag">Samsung SmartTag</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Tag Serial</Form.Label>
            <Form.Control type="text" name="tagSerial" value={formData.tagSerial || ""} onChange={handleChange} />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Adoption Date</Form.Label>
            <Form.Control type="date" name="adoptionDate" value={formData.adoptionDate || ""} onChange={handleChange} />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Training Level</Form.Label>
            <Form.Control type="text" name="trainingLevel" value={formData.trainingLevel || ""} onChange={handleChange} />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Personality</Form.Label>
        <Form.Control type="text" name="personality" value={formData.personality || ""} onChange={handleChange} />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
    <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
  </Modal.Footer>
</Modal>

    </Container>
  );
}

export default ManagePets;
