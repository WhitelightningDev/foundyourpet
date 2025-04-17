import React from "react";
import { Modal, Button, Row, Col, Container, Image } from "react-bootstrap";

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
    console.log("Modal close button clicked");
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleModalClose} size="xl" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">{pet.name}'s Profile</Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 py-3">
        <Container fluid>
          {/* Pet Image */}
          <Row className="mb-4 justify-content-center">
            <Col md={6} className="text-center">
              {pet.photoUrl ? (
                <Image
                  src={`https://foundyourpet-backend.onrender.com${pet.photoUrl}`}
                  alt={`${pet.name}'s image`}
                  fluid
                  rounded
                />
              ) : (
                <div className="text-muted">No photo available</div>
              )}
            </Col>
          </Row>

          {/* Pet Details */}
          <Row>
            <Col md={6}>
              <h6 className="text-primary mb-3">Basic Information</h6>
              {renderField("Species", pet.species)}
              {renderField("Breed", pet.breed)}
              {renderField("Gender", pet.gender)}
              {renderField("Age", pet.age)}
              {renderField("Color", pet.color)}
              <hr className="my-4" />
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
