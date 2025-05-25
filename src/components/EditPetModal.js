import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditPetModal = ({ show, formData, handleChange, handleClose, handleSave }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      dialogClassName="rounded-5"
      contentClassName="border-0 shadow-lg bg-white"
    >
      <Modal.Header closeButton className="border-0 pb-3">
        <Modal.Title
          className="fw-bold"
          style={{ fontSize: "1.75rem", color: "#0071e3", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif" }}
        >
          Edit Pet
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-5 py-4">
        <Form>
          {[
            { id: "petName", label: "Name", type: "text", name: "name" },
            { id: "petSpecies", label: "Species", type: "select", name: "species", options: ["Dog", "Cat", "Other"] },
            { id: "petBreed", label: "Breed", type: "text", name: "breed" },
            { id: "petAge", label: "Age", type: "number", name: "age" },
            { id: "petGender", label: "Gender", type: "select", name: "gender", options: ["Male", "Female"] },
            { id: "petDob", label: "Date of Birth", type: "date", name: "dateOfBirth" },
            { id: "petColor", label: "Color", type: "text", name: "color" },
            { id: "petSpayedNeutered", label: "Spayed/Neutered", type: "select", name: "spayedNeutered", options: ["Yes", "No"] },
            { id: "petTrainingLevel", label: "Training Level", type: "select", name: "trainingLevel", options: ["Untrained", "Basic", "Intermediate", "Advanced"] },
          ].map(({ id, label, type, name, options }) => (
            <Form.Group controlId={id} className="mb-4" key={id}>
              <Form.Label className="fw-semibold" style={{ fontSize: "1rem" }}>
                {label}
              </Form.Label>
              {type === "select" ? (
                <Form.Control
                  as="select"
                  name={name}
                  value={formData[name] || ""}
                  onChange={handleChange}
                  className="shadow-sm rounded-3"
                  style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}
                >
                  <option value="">Select</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Form.Control>
              ) : (
                <Form.Control
                  type={type}
                  name={name}
                  value={formData[name] || ""}
                  onChange={handleChange}
                  className="shadow-sm rounded-3"
                  style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}
                />
              )}
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-3">
        <Button
          variant="outline-secondary"
          onClick={handleClose}
          style={{
            borderRadius: "9999px",
            padding: "0.5rem 2rem",
            fontWeight: 600,
            fontSize: "1rem",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            transition: "all 0.3s ease",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          style={{
            borderRadius: "9999px",
            padding: "0.5rem 2.5rem",
            fontWeight: 600,
            fontSize: "1rem",
            boxShadow: "0 4px 15px rgba(0,112,227,0.5)",
            backgroundColor: "#0071e3",
            borderColor: "#0071e3",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#005bb5";
            e.currentTarget.style.borderColor = "#005bb5";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,91,181,0.7)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#0071e3";
            e.currentTarget.style.borderColor = "#0071e3";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,112,227,0.5)";
          }}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditPetModal;
