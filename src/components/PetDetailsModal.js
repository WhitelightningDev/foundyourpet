import React from "react";
import { Modal, Button, Row, Col, Container, Image, Card } from "react-bootstrap";

// Helper function to render fields with labels and values
const renderField = (label, value) => (
  <div className="d-flex mb-2">
    <div className="me-2 fw-semibold" style={{ minWidth: "120px" }}>
      {label}:
    </div>
    <div>{value || "N/A"}</div>
  </div>
);

const PetDetailsModal = ({ show, handleClose, pet }) => {
  if (!pet) return null;

  const handleModalClose = () => {
    console.log("Modal close button clicked");
    handleClose();
  };

  console.log(PetDetailsModal)

  return (
    <Modal show={show} onHide={handleModalClose} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">{pet.name}'s Profile</Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 py-3">
        <Container fluid>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Row className="justify-content-center text-center mb-4">
                <Col xs={12}>
                  {pet.photoUrl ? (
                    <Image
                    src={pet.photoUrl.startsWith("http") ? pet.photoUrl : `https://foundyourpet-backend.onrender.com${pet.photoUrl}`}
                      alt={`${pet.name}'s image`}
                      roundedCircle
                      style={{ width: "200px", height: "200px", objectFit: "cover" }}
                      className="mb-3"
                    />
                  ) : (
                    <div className="text-muted">No photo available</div>
                  )}
                </Col>
              </Row>

              <Row className="justify-content-center">
                <Col xs={12} md={8}>
                  <h5 className="text-primary text-center mb-3">Basic Information</h5>
                  {renderField("Species", pet.species)}
                  {renderField("Breed", pet.breed)}
                  {renderField("Gender", pet.gender)}
                  {renderField("Age", pet.age)}
                  {renderField("Color", pet.color)}
                  {renderField("Membership Status", pet.hasMembership ? "Active ✅" : "Not Active ❌")}
                </Col>
              </Row>
            </Card.Body>
          </Card>
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
