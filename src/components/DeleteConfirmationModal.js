import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";

const DeleteConfirmationModal = ({
  show,
  handleClose,
  handleConfirm,
  isDeleting,
  deletionSuccess
}) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {deletionSuccess ? "Deleted Successfully" : "Confirm Deletion"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {deletionSuccess ? (
          <p className="text-success">Pet has been deleted successfully.</p>
        ) : (
          <p>Are you sure you want to delete this pet?</p>
        )}
      </Modal.Body>
      {!deletionSuccess && (
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="danger" onClick={handleConfirm} disabled={isDeleting}>
            {isDeleting ? <Spinner size="sm" animation="border" /> : "Delete"}
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default DeleteConfirmationModal;
