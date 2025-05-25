import React from "react";
import { Button, ListGroup } from "react-bootstrap";
import { FaEye, FaEdit, FaTrash, FaCartPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PetListSkeleton from "../loadingskeletons/PetListSkeleton";

const buttonStyles = {
  borderRadius: "9999px", // pill shape
  fontWeight: 600,
  fontSize: "0.9rem",
  padding: "6px 16px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
  transition: "all 0.25s ease",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  userSelect: "none",
};

const buttonHoverShadow = "0 4px 12px rgba(0,0,0,0.18)";
const buttonActiveScale = "scale(0.97)";

const PetListSection = ({
  title,
  pets,
  loading,
  handleViewDetails,
  handleEditClick,
  handleDeleteClick,
}) => {
  const navigate = useNavigate();

  const createButton = (variant, onClick, Icon, label, styleOverrides = {}) => {
    // Define color sets for variants Apple style (soft pastels / flat)
    const colorSets = {
      view: { bg: "#f0f5ff", color: "#0071e3", border: "#c2d1f0" },
      edit: { bg: "#e6f5ea", color: "#28a745", border: "#a9d4af" },
      delete: { bg: "#fdecea", color: "#d93025", border: "#f9c7c5" },
      order: { bg: "#e6f0f6", color: "#0a84ff", border: "#bdd4f6" },
    };

    const colors = colorSets[variant] || colorSets.view;

    return (
      <Button
        onClick={onClick}
        style={{
          ...buttonStyles,
          backgroundColor: colors.bg,
          color: colors.color,
          border: `1.5px solid ${colors.border}`,
          ...styleOverrides,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = buttonHoverShadow;
          e.currentTarget.style.backgroundColor = colors.color;
          e.currentTarget.style.color = "#fff";
          e.currentTarget.style.borderColor = colors.color;
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = buttonStyles.boxShadow;
          e.currentTarget.style.backgroundColor = colors.bg;
          e.currentTarget.style.color = colors.color;
          e.currentTarget.style.borderColor = colors.border;
          e.currentTarget.style.transform = "scale(1)";
        }}
        onMouseDown={e => {
          e.currentTarget.style.transform = buttonActiveScale;
        }}
        onMouseUp={e => {
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        size="sm"
        className="d-flex"
      >
        <Icon />
        {label}
      </Button>
    );
  };

  return (
    <div className="mb-5">
      <h4
        className="mb-4 fw-semibold text-secondary"
        style={{ fontSize: "1.5rem" }}
      >
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
              onMouseEnter={e =>
                (e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)")
              }
              onMouseLeave={e =>
                (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)")
              }
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
                <p className="mb-0" style={{ color: "#6e6e73", fontSize: "0.9rem" }}>
                  {pet.breed}
                </p>
              </div>

              {/* Buttons */}
              <div className="d-flex flex-wrap gap-2">
                {createButton("view", () => handleViewDetails(pet), FaEye, "View")}
                {createButton("edit", () => handleEditClick(pet), FaEdit, "Edit")}
                {createButton(
                  "delete",
                  () => handleDeleteClick(pet._id),
                  FaTrash,
                  "Delete"
                )}
                {createButton(
                  "order",
                  () => navigate("/select-tag/standard"),
                  FaCartPlus,
                  "Order Tag"
                )}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p className="text-muted fst-italic">
          You don't have any {title.toLowerCase()}.
        </p>
      )}
    </div>
  );
};

export default PetListSection;
