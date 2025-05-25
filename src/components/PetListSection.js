import React from "react";
import { Button, ListGroup } from "react-bootstrap";
import { FaEye, FaEdit, FaTrash, FaCartPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PetListSkeleton from "../loadingskeletons/PetListSkeleton";

const PetListSection = ({
  title,
  pets,
  loading,
  handleViewDetails,
  handleEditClick,
  handleDeleteClick,
}) => {
  const navigate = useNavigate();

  return (
    <div className="mb-5">
      <h4 className="mb-4 fw-semibold text-secondary" style={{ fontSize: "1.5rem" }}>
        {title}
      </h4>

      {loading ? (
        <PetListSkeleton count={3} />
      ) : pets.length > 0 ? (
        <ListGroup as="div" className="gap-3">
          {pets.map((pet) => (
            <ListGroup.Item
              key={pet._id}
              className="d-flex align-items-center gap-4 bg-white rounded-3 shadow-sm p-3"
              style={{
                cursor: "default",
                transition: "box-shadow 0.3s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"}
            >
              {/* Pet Image */}
              {pet.photoUrl ? (
                <img
                  src={
                    pet.photoUrl.startsWith("http")
                      ? pet.photoUrl
                      : `https://foundyourpet-backend.onrender.com${pet.photoUrl}`
                  }
                  alt={`${pet.name}'s profile`}
                  style={{
                    width: "64px",
                    height: "64px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    backgroundColor: "#e0e0e0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.85rem",
                    color: "#a0a0a0",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  No Photo
                </div>
              )}

              {/* Pet Info */}
              <div className="flex-grow-1">
                <h5
                  className="mb-1"
                  style={{
                    fontWeight: 600,
                    color: "#1c1c1e",
                    fontSize: "1.125rem",
                  }}
                >
                  {pet.name}
                </h5>
                <p
                  className="mb-0"
                  style={{ color: "#6e6e73", fontSize: "0.9rem" }}
                >
                  {pet.breed}
                </p>
              </div>

              {/* Buttons */}
              <div className="d-flex flex-wrap gap-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handleViewDetails(pet)}
                  className="d-flex align-items-center gap-1"
                  style={{ fontWeight: 500 }}
                >
                  <FaEye />
                  View
                </Button>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleEditClick(pet)}
                  className="d-flex align-items-center gap-1"
                  style={{ fontWeight: 500 }}
                >
                  <FaEdit />
                  Edit
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDeleteClick(pet._id)}
                  className="d-flex align-items-center gap-1"
                  style={{ fontWeight: 500 }}
                >
                  <FaTrash />
                  Delete
                </Button>
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={() => navigate("/select-tag/standard")}
                  className="d-flex align-items-center gap-1"
                  style={{ fontWeight: 500 }}
                >
                  <FaCartPlus />
                  Order Tag
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p className="text-muted fst-italic">You don't have any {title.toLowerCase()}.</p>
      )}
    </div>
  );
};

export default PetListSection;
