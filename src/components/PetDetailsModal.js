import React from "react";
import { Modal, Button, Row, Col, Image, Card, Container } from "react-bootstrap";

const renderField = (label, value) => (
  <Row className="mb-2 align-items-start">
    <Col xs={5} className="text-muted fw-semibold text-end pe-2" style={{ fontSize: "0.85rem" }}>
      {label}:
    </Col>
    <Col xs={7} className="text-dark fw-semibold" style={{ fontSize: "0.95rem" }}>
      {value || "N/A"}
    </Col>
  </Row>
);

const PetDetailsModal = ({ show, handleClose, pet }) => {
  if (!pet) return null;

  const getImageSrc = () =>
    pet.photoUrl?.startsWith("http")
      ? pet.photoUrl
      : `https://foundyourpet-backend.onrender.com${pet.photoUrl}`;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      dialogClassName="rounded-5"
      contentClassName="border-0 shadow-lg"
      // Restrict modal max height to viewport height
      style={{ maxHeight: "85vh" }}
    >
      <Modal.Header closeButton className="border-0 pb-2">
        <Modal.Title
          className="fw-bold"
          style={{ fontSize: "1.5rem", color: "#0071e3" }}
        >
          {pet.name}&apos;s Profile
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="bg-white px-4 py-3">
        <Container fluid>
          <Card className="border-0 shadow-sm rounded-4 p-3" style={{ maxHeight: "70vh" }}>
            <Row className="g-4">
              {/* Left Column - Image */}
              <Col xs={12} md={4} className="text-center">
                {pet.photoUrl ? (
                  <Image
                    src={getImageSrc()}
                    alt={`${pet.name}'s image`}
                    roundedCircle
                    className="mb-3 shadow"
                    style={{
                      width: "160px",
                      height: "160px",
                      objectFit: "cover",
                      border: "5px solid #fff",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    }}
                  />
                ) : (
                  <div
                    className="text-muted fst-italic"
                    style={{ fontSize: "1rem", padding: "72px 0" }}
                  >
                    No photo available
                  </div>
                )}
                <h5 className="fw-bold text-dark mt-2" style={{ fontSize: "1.25rem" }}>
                  {pet.name}
                </h5>
              </Col>

              {/* Right Column - Info */}
              <Col xs={12} md={8} style={{ overflowY: "auto", maxHeight: "60vh" }}>
                <h6
                  className="text-uppercase fw-semibold mb-3 pb-1 border-bottom"
                  style={{ color: "#6e6e73", letterSpacing: "1.5px", fontSize: "0.85rem" }}
                >
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
                    <span className="text-success fw-semibold">Active ✅</span>
                  ) : (
                    <span className="text-danger fw-semibold">Not Active ❌</span>
                  )
                )}
              </Col>
            </Row>
          </Card>
        </Container>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-2">
        <Button
          variant="outline-secondary"
          onClick={handleClose}
          className="rounded-pill px-4 fw-semibold"
          style={{
            fontSize: "1rem",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PetDetailsModal;
