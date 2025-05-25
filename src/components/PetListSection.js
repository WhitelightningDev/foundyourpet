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
      <h4 className="mb-3 text-primary">{title}</h4>

      {loading ? (
        <PetListSkeleton count={3} />
      ) : pets.length > 0 ? (
        <ListGroup>
          {pets.map((pet) => (
            <ListGroup.Item
              key={pet._id}
              className="mb-3 shadow-sm rounded p-3 bg-light"
            >
              <div className="d-flex justify-content-between align-items-center gap-3">
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
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      backgroundColor: "#ccc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      color: "#666",
                    }}
                  >
                    No Photo
                  </div>
                )}

                {/* Pet Info */}
                <div className="flex-grow-1">
                  <h5 className="mb-1">{pet.name}</h5>
                  <p className="mb-0 text-muted">{pet.breed}</p>
                </div>

                {/* Buttons */}
                <div className="pet-button-group d-flex flex-wrap gap-1">
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => handleViewDetails(pet)}
                  >
                    <FaEye className="me-1" /> View
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleEditClick(pet)}
                  >
                    <FaEdit className="me-1" /> Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(pet._id)}
                  >
                    <FaTrash className="me-1" /> Delete
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => navigate("/select-tag/standard")}
                  >
                    <FaCartPlus className="me-1" /> Order Tag
                  </Button>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p className="text-muted">You don't have any {title.toLowerCase()}.</p>
      )}
    </div>
  );
};

export default PetListSection;
