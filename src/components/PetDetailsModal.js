import React from "react";
import { Modal, Button, Row, Col, Container } from "react-bootstrap";

// Helper function to render fields with labels and values
const renderField = (label, value) => (
  <div className="d-flex mb-2">
    <div className="me-2 fw-semibold" style={{ minWidth: "140px" }}>
      {label}:
    </div>
    <div>{value || "N/A"}</div>
  </div>
);

const PetDetailsModal = ({ show, handleClose, pet }) => {
  if (!pet) return null; // Prevent rendering if pet is null or undefined

  const handleModalClose = () => {
    console.log("Modal close button clicked"); // Debugging line
    handleClose(); // Call the handleClose function passed as prop
  };

  return (
    <Modal
      show={show}
      onHide={handleModalClose} // Use the updated close handler
      size="xl"
      centered
      scrollable
    >
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">{pet.name}'s Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 py-3">
        <Container fluid>
          <Row>
            {/* Left Column */}
            <Col md={6}>
              <h6 className="text-primary mb-3">Basic Information</h6>
              {renderField("Species", pet.species)}
              {renderField("Breed", pet.breed)}
              {renderField("Gender", pet.gender)}
              {renderField("Age", pet.age)}
              {renderField(
                "Date of Birth",
                pet.dateOfBirth ? new Date(pet.dateOfBirth).toLocaleDateString() : "N/A"
              )}
              {renderField("Color", pet.color)}
              {renderField("Size", pet.size)}
              {renderField("Weight (kg)", pet.weight)}
              {renderField("Spayed/Neutered", pet.spayedNeutered ? "Yes" : "No")}

              <hr className="my-4" />

              <h6 className="text-primary mb-3">Identification & Tags</h6>
              {renderField("Microchip Number", pet.microchipNumber)}
              {renderField("Tag Type", pet.tagType)}
              {renderField("Tag Serial", pet.tagSerial)}
              {renderField("Engraving Info", pet.engravingInfo)}
            </Col>

            {/* Right Column */}
            <Col md={6}>
              <h6 className="text-primary mb-3">Behavior & Lifestyle</h6>
              {renderField("Training Level", pet.trainingLevel)}
              {renderField("Personality", pet.personality)}
              {renderField("Dietary Preferences", pet.dietaryPreferences)}
              {renderField(
                "Adoption Date",
                pet.adoptionDate ? new Date(pet.adoptionDate).toLocaleDateString() : "N/A"
              )}

              <hr className="my-4" />

              <h6 className="text-primary mb-3">Medical Information</h6>
              {renderField("Vet Info", pet.vetInfo)}
              {renderField("Insurance Info", pet.insuranceInfo)}
              {renderField("Vaccinations", pet.vaccinations?.join(", ") || "N/A")}
              {renderField("Allergies", pet.allergies?.join(", ") || "N/A")}
              {renderField("Medical Conditions", pet.medicalConditions?.join(", ") || "N/A")}
              {renderField("Medications", pet.medications?.join(", ") || "N/A")}
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PetDetailsModal;
