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
              value={formData.name || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="petSpecies">
            <Form.Label>Species</Form.Label>
            <Form.Control
              as="select"
              name="species"
              value={formData.species || ""}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Other">Other</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="petBreed">
            <Form.Label>Breed</Form.Label>
            <Form.Control
              type="text"
              name="breed"
              value={formData.breed || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="petAge">
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="number"
              name="age"
              value={formData.age || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="petGender">
            <Form.Label>Gender</Form.Label>
            <Form.Control
              as="select"
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="petDob">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="petColor">
            <Form.Label>Color</Form.Label>
            <Form.Control
              type="text"
              name="color"
              value={formData.color || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="petSpayedNeutered">
            <Form.Label>Spayed/Neutered</Form.Label>
            <Form.Control
              as="select"
              name="spayedNeutered"
              value={formData.spayedNeutered || ""}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="petTrainingLevel">
            <Form.Label>Training Level</Form.Label>
            <Form.Control
              as="select"
              name="trainingLevel"
              value={formData.trainingLevel || ""}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Untrained">Untrained</option>
              <option value="Basic">Basic</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </Form.Control>
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
