import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  Form,
  Spinner,
  ListGroup,
  Toast,
  ToastContainer,
  Row,
  Col,
} from "react-bootstrap";
import { FaCheck } from "react-icons/fa";
import axios from "axios";

function SelectTagPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const tagPrice = 250;

  // Initialize user and pets from location.state if available
  const initialUser = location.state?.user || {
    name: "",
    email: "",
    isAdmin: false,
    membershipActive: false,
    contact: "",
    membershipStartDate: "",
    address: {
      street: "",
      city: "",
      province: "",
      postalCode: "",
      country: "",
    },
  };
  const initialPets = location.state?.pet ? [location.state.pet] : [];

  const [user, setUser] = useState(initialUser);
  const [pets, setPets] = useState(initialPets);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedPets, setSelectedPets] = useState(
    initialPets.length ? [initialPets[0]._id] : []
  );

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    async function fetchData() {
      try {
        const petRes = await axios.get("https://foundyourpet-backend.onrender.com/api/pets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPets(petRes.data);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchUser() {
      if (!location.state?.user) {
        try {
          const response = await axios.get(
            "https://foundyourpet-backend.onrender.com/api/users/me",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log("User data:", response.data.user);
          const userData = response.data.user;
          setUser({
            name: userData.name?.trim() || "",
            email: userData.email || "",
            isAdmin: userData.isAdmin || false,
            membershipActive: userData.membershipActive || false,
            membershipStartDate: userData.membershipStartDate || "",
            contact: userData.contact || "",
            address: userData.address || {
              street: "",
              city: "",
              province: "",
              postalCode: "",
              country: "",
            },
          });
        } catch (error) {
          console.error("Failed to fetch user info:", error);
        }
      }
    }

    fetchUser();
    fetchData();
  }, [location.state]);

  const handlePetSelection = (pet) => {
    if (!pet?.hasMembership) {
      setToastMessage("This pet needs an active subscription before you can order a tag.");
      setShowToast(true);
      return;
    }
    setSelectedPets((prev) =>
      prev.includes(pet._id)
        ? prev.filter((id) => id !== pet._id)
        : [...prev, pet._id]
    );
  };

  const handleContinue = () => {
    if (selectedPets.length === 0) {
      setToastMessage("Please select at least one pet to continue.");
      setShowToast(true);
      return;
    }

    const selectedPetDetails = pets
      .filter((pet) => selectedPets.includes(pet._id))
      .map((pet) => ({
        ...pet,
        userId: user._id,
      }));

    const finalPrice = selectedPets.length * tagPrice;

    navigate("/checkout", {
      state: {
        package: { type: "Normal Tag" },
        total: finalPrice,
        membership: false,
        membershipObjectId: null,
        selectedPets: selectedPetDetails,
        userId: user._id,
      },
    });
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container fluid="md" className="my-5 px-3">
      {/* Header */}
      <h2
        className="border-bottom pb-3 mb-4 text-center fw-semibold"
        style={{ fontSize: "1.9rem", color: "#0071e3" }}
      >
        Great Stuff, {user.name}
      </h2>

      {/* Info Card */}
      <Card
        className="d-flex flex-row align-items-center shadow-sm mb-4"
        style={{
          borderRadius: "16px",
          backgroundColor: "#f5f7fa",
          padding: "1rem 1.5rem",
          gap: "1rem",
        }}
      >
        <div
          style={{
            backgroundColor: "#0071e3",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            flexShrink: 0,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            width="20"
            height="20"
          >
            <path d="M13 7.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-3 3.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v4.25h.75a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5h.75V12h-.75a.75.75 0 0 1-.75-.75Z"></path>
            <path d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1ZM2.5 12a9.5 9.5 0 0 0 19 0 9.5 9.5 0 0 0-19 0Z"></path>
          </svg>
        </div>
        <div>
          <p
            className="mb-1 fw-semibold"
            style={{ fontSize: "1.1rem", color: "#333" }}
          >
            Please Note
          </p>
          <p className="mb-0" style={{ fontSize: "0.9rem", color: "#666" }}>
            Make sure you have added all your pets before purchasing tags
          </p>
        </div>
      </Card>

      {/* Package Card */}
      <Card
        className="shadow border-0 mx-auto mb-4"
        style={{
          borderRadius: "20px",
          maxWidth: "520px",
          backgroundColor: "white",
          padding: "2rem 1.5rem",
          textAlign: "center",
        }}
      >
        <span
          className="d-block mb-3"
          style={{ fontSize: "1.6rem", fontWeight: "600", color: "#0071e3" }}
        >
          R{tagPrice.toFixed(2)}{" "}
          <small className="text-primary" style={{ fontWeight: "500" }}>
            one-off per tag
          </small>
        </span>
        <p className="h4 fw-bold mt-4 mb-2">
          Normal Tag
        </p>
        <p className="text-muted mb-3">
          Order physical tags for pets with an active subscription.
        </p>
        <ul
          className="list-unstyled text-start px-3"
          style={{ fontSize: "0.95rem", color: "#555", lineHeight: 1.5 }}
        >
          {[
            "Custom engraving",
            "QR code linked to your pet profile",
            "Doorstep or PUDO delivery",
          ].map((feature) => (
            <li key={feature} className="d-flex align-items-center mb-2">
              <FaCheck size={14} style={{ color: "#0071e3", marginRight: "0.5rem" }} />
              {feature}
            </li>
          ))}
        </ul>
      </Card>

      {/* Pet Selection */}
      <div className="mb-4" style={{ maxWidth: "600px", margin: "auto" }}>
        <h5
          className="mb-3 fw-semibold"
          style={{ fontSize: "1.3rem", color: "#222" }}
        >
          Select Pets for Tag Order
        </h5>
        <ListGroup
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgb(0 0 0 / 0.1)",
          }}
        >
          {pets.map((pet) => (
            <ListGroup.Item
              key={pet._id}
              action
              onClick={() => handlePetSelection(pet)}
              active={selectedPets.includes(pet._id)}
              disabled={!pet.hasMembership}
              className="d-flex justify-content-between align-items-center"
              style={{
                cursor: "pointer",
                fontWeight: selectedPets.includes(pet._id) ? "600" : "400",
                fontSize: "1rem",
                transition: "background-color 0.2s ease",
                border: "none",
                borderBottom: "1px solid #eee",
                opacity: pet.hasMembership ? 1 : 0.55,
              }}
            >
              <span>
                {pet.name} <small className="text-muted">({pet.species})</small>
                {!pet.hasMembership ? (
                  <small className="text-muted"> • subscription required</small>
                ) : null}
              </span>
              <Form.Check
                type="checkbox"
                checked={selectedPets.includes(pet._id)}
                onChange={() => handlePetSelection(pet)}
                onClick={(e) => e.stopPropagation()}
                style={{ transform: "scale(1.2)" }}
                disabled={!pet.hasMembership}
                aria-label={`Select pet ${pet.name}`}
              />
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>

      {/* Total and Continue */}
      <Row
        className="mt-4"
        style={{ maxWidth: "600px", margin: "auto", alignItems: "center" }}
      >
        <Col xs={12} md={6} className="mb-3 mb-md-0">
          <h5 style={{ fontWeight: "600", fontSize: "1.3rem" }}>
            Total:{" "}
            <span className="text-primary">
              R{(tagPrice * selectedPets.length).toFixed(2)}
            </span>
          </h5>
        </Col>
        <Col xs={12} md={6} className="text-md-end">
          <Button
            variant="primary"
            size="lg"
            onClick={handleContinue}
            disabled={selectedPets.length === 0}
            aria-disabled={selectedPets.length === 0}
          >
            Continue
          </Button>
        </Col>
      </Row>

      {/* Toast */}
      <ToastContainer position="bottom-center" className="mb-3">
        <Toast
          bg="warning"
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          style={{ minWidth: "280px" }}
          role="alert"
          aria-live="assertive"
        >
          <Toast.Body>{toastMessage || "Please select at least one pet to continue."}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}

export default SelectTagPage;
