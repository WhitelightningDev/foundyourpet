import React from "react";
import { Modal, Button, Card, Row, Col, Badge } from "react-bootstrap";
import { QRCodeCanvas } from "qrcode.react";
import { FaQrcode } from "react-icons/fa";

function UserDetailsModal({ show, onHide, user, pets, handleShowQRModal }) {
  if (!user) return null;

  return (
    <Modal show={show} onHide={onHide} size="xl" centered className="apple-style-modal">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-semibold text-dark fs-4">User Profile Overview</Modal.Title>
      </Modal.Header>

      <Modal.Body>
  <Row className="h-100">
    {/* Left: User Info */}
    <Col md={4} className="d-flex">
      <Card className="shadow-lg border-0 rounded-4 w-100 h-100">
        <Card.Body className="text-center d-flex flex-column justify-content-center">
          <h4 className="fw-semibold text-dark">{user.name} {user.surname}</h4>
          <p className="text-muted mb-2"><strong>Email:</strong> {user.email}</p>
          <p className="text-muted mb-2"><strong>Contact:</strong> {user.contact}</p>
          <p className="text-muted"><strong>Address:</strong> {user.address?.street}, {user.address?.city}</p>
        </Card.Body>
      </Card>
    </Col>

    {/* Right: Pet Info */}
    <Col md={8} className="d-flex flex-column">
      <h5 className="text-dark fw-semibold mb-3 text-center">Registered Pets</h5>

      <div className="overflow-auto" style={{ maxHeight: '65vh' }}>
        {pets.length === 0 ? (
          <div className="text-center text-muted fs-6">No pets found.</div>
        ) : (
          pets.map((pet) => (
            <Card key={pet._id} className="mb-3 shadow-lg border-0 rounded-4">
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={3} className="text-center">
                    {pet.photoUrl ? (
                      <img
                        src={
                          pet.photoUrl.startsWith("http")
                            ? pet.photoUrl
                            : `https://foundyourpet-backend.onrender.com${pet.photoUrl}`
                        }
                        alt={`${pet.name}'s profile`}
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "1px solid #ccc",
                        }}
                      />
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-center bg-light text-muted"
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: "50%",
                          fontSize: "0.9rem",
                        }}
                      >
                        No Image
                      </div>
                    )}
                  </Col>

                  <Col md={9}>
                    <Row>
                      <Col md={6}>
                        <h6 className="fw-semibold text-dark">{pet.name}</h6>
                        <p className="text-muted mb-1">{pet.species} • {pet.breed}</p>
                        <p className="text-muted mb-1"><strong>Age:</strong> {pet.age} yrs</p>
                        <p className="text-muted mb-1"><strong>Gender:</strong> {pet.gender}</p>
                      </Col>
                      <Col md={6}>
                        <p className="text-muted mb-1"><strong>Spayed/Neutered:</strong> {pet.spayedNeutered ? "Yes" : "No"}</p>
                        <p className="text-muted mb-1"><strong>Tag Type:</strong> {pet.tagType || "N/A"}</p>
                        <p className="text-muted mb-1"><strong>Membership:</strong> 
                          {" "}
                          <Badge bg={pet.hasMembership ? "success" : "secondary"} pill>
                            {pet.hasMembership ? "Active" : "Inactive"}
                          </Badge>
                        </p>
                        {pet.hasMembership && (
                          <>
                            <p className="text-muted mb-1"><strong>Type:</strong> {pet.membership}</p>
                            <p className="text-muted mb-1"><strong>Start:</strong> {new Date(pet.membershipStartDate).toLocaleDateString()}</p>
                          </>
                        )}
                      </Col>
                    </Row>

                    <div className="text-end mt-3">
                      <Button variant="outline-dark" size="sm" onClick={() => handleShowQRModal(pet)}>
                        <FaQrcode className="me-1" /> View PDF
                      </Button>
                      <QRCodeCanvas
                        id={`qr-${pet._id}`}
                        value={`https://foundyourpet.vercel.app/p/${pet._id}`}
                        size={128}
                        level="L"
                        includeMargin
                        className="d-none"
                      />
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    </Col>
  </Row>
</Modal.Body>


      <Modal.Footer className="border-0">
        <Button variant="outline-secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UserDetailsModal;
