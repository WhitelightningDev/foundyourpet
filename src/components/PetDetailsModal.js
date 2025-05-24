import React from "react";
import { Modal, Button, Row, Col, Container, Image, Card } from "react-bootstrap";

const renderField = (label, value) => (
  <Row className="mb-2 align-items-start">
    <Col xs={5} className="text-muted fw-medium text-end pe-3">
      {label}:
    </Col>
    <Col xs={7} className="text-dark fw-semibold">
      {value || "N/A"}
    </Col>
  </Row>
);

const PetDetailsModal = ({ show, handleClose, pet }) => {
  if (!pet) return null;

  const handleModalClose = () => handleClose();

  const getImageSrc = () =>
    pet.photoUrl?.startsWith("http")
      ? pet.photoUrl
      : `https://foundyourpet-backend.onrender.com${pet.photoUrl}`;

  return (
    <Modal show={show} onHide={handleModalClose} size="lg" centered scrollable>
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold fs-4 text-primary">
          {pet.name}&apos;s Profile
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="bg-light-subtle px-4 py-3">
        <Container fluid>
          <Card className="border-0 shadow rounded-4 p-4">
            <Row className="justify-content-center mb-4">
              <Col xs={12} className="text-center">
                {pet.photoUrl ? (
                  <Image
                    src={getImageSrc()}
                    alt={`${pet.name}'s image`}
                    roundedCircle
                    className="mb-3 shadow-sm"
                    style={{
                      width: "160px",
                      height: "160px",
                      objectFit: "cover",
                      border: "4px solid #fff",
                    }}
                  />
                ) : (
                  <div className="text-muted">No photo available</div>
                )}
                <h5 className="fw-bold text-dark mt-2">{pet.name}</h5>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col xs={12} md={10} lg={8}>
                <h6 className="text-secondary text-uppercase fw-semibold mb-3 border-bottom pb-2">
                  Basic Information
                </h6>
                {renderField("Species", pet.species)}
                {renderField("Breed", pet.breed)}
                {renderField("Gender", pet.gender)}
                {renderField("Age", pet.age)}
                {renderField("Color", pet.color)}
                {renderField(
                  "Membership Status",
                  pet.hasMembership ? (
                    <span className="text-success">Active ✅</span>
                  ) : (
                    <span className="text-danger">Not Active ❌</span>
                  )
                )}
              </Col>
            </Row>
          </Card>
        </Container>
      </Modal.Body>

      <Modal.Footer className="border-0">
        <Button variant="outline-secondary" onClick={handleModalClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PetDetailsModal;
