import React from "react";
import { Modal, Button, Row, Col, Card, Badge } from "react-bootstrap";

function UserProfileModal({ showModal, handleClose, selectedUser, pets, handleShowQRModal }) {
  return (
    <Modal show={showModal} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>User Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedUser && (
          <Row>
            {/* Left Column for User Info */}
            <Col md={4}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <h5 className="text-success mb-3">
                    {selectedUser.name} {selectedUser.surname}
                  </h5>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Contact:</strong> {selectedUser.contact}</p>
                  <p><strong>Address:</strong> {selectedUser.address?.street}, {selectedUser.address?.city}</p>
                </Card.Body>
              </Card>
            </Col>

            {/* Right Column for Pets */}
            <Col md={8}>
              <h4 className="text-primary mb-4 border-bottom pb-2">Pets</h4>
              {pets.length === 0 ? (
                <p className="text-muted">No pets found.</p>
              ) : (
                pets.map((pet) => (
                  <Card key={pet._id} className="mb-3 shadow-sm border-0">
                    <Card.Body className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5>{pet.name}</h5>
                        <p className="text-muted">{pet.species} - {pet.breed}</p>
                      </div>
                      <div className="text-end">
                        <Badge bg="info" className="mb-2 px-3 py-1">Pet</Badge>
                        <Button 
                          size="sm" 
                          variant="outline-success" 
                          onClick={() => handleShowQRModal(pet)}
                          className="ms-2">
                          View QR Code
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))
              )}
            </Col>
          </Row>
        )}
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UserProfileModal;
