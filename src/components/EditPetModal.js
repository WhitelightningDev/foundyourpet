import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditPetModal = ({ show, formData, handleChange, handleClose, handleSave }) => {
  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Pet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="petName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="petSpecies">
            <Form.Label>Species</Form.Label>
            <Form.Control
              type="text"
              name="species"
              value={formData.species}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="petBreed">
            <Form.Label>Breed</Form.Label>
            <Form.Control
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="petAge">
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="text"
              name="age"
              value={formData.age}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={handleSave}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditPetModal;
