import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const { tagType } = useParams();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);
 const [user, setUser] = useState({
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
  });
  const [pets, setPets] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [selectedPets, setSelectedPets] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    async function fetchData() {
      try {
        const [pkgRes, addonRes, petRes] = await Promise.all([
          axios.get(
            `https://foundyourpet-backend.onrender.com/api/packages/type/${tagType}`
          ),
          axios.get(
            `https://foundyourpet-backend.onrender.com/api/addons/filter?type=${tagType}`
          ),
          axios.get("https://foundyourpet-backend.onrender.com/api/pets", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setSelectedPackage(pkgRes.data);
        setAddons(addonRes.data);
        setPets(petRes.data);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "https://foundyourpet-backend.onrender.com/api/users/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

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
    };

    fetchUser();
    fetchData();
  }, [tagType]);

  const handlePetSelection = (pet) => {
    setSelectedPets((prev) =>
      prev.includes(pet._id)
        ? prev.filter((id) => id !== pet._id)
        : [...prev, pet._id]
    );
  };

  const handleContinue = () => {
    if (selectedPets.length === 0) {
      setShowToast(true);
      return;
    }

    const base = selectedPackage?.price || 0;
    const petTotal = selectedPets.length * base;
    const finalPrice = petTotal;

    const selectedPetDetails = pets
      .filter((pet) => selectedPets.includes(pet._id))
      .map((pet) => ({
        ...pet,
        userId: user._id,
      }));

    const membershipId = selectedPackage?.membershipId;

    navigate("/checkout", {
      state: {
        package: selectedPackage.name,
        total: finalPrice,
        membership: true,
        membershipObjectId: membershipId,
        selectedPets: selectedPetDetails,
        userId: user._id,
      },
    });
  };

  if (loading || !selectedPackage) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container fluid="md" className="my-5 px-3">
      {/* Header */}
      <h2 className="border-bottom pb-3 mb-4 text-center fw-semibold" style={{ fontSize: "1.9rem", color: "#0071e3" }}>
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
          <p className="mb-1 fw-semibold" style={{ fontSize: "1.1rem", color: "#333" }}>
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
        <span className="d-block mb-3" style={{ fontSize: "1.6rem", fontWeight: "600", color: "#0071e3" }}>
          R{selectedPackage.price.toFixed(2)} Initial{" "}
          <small className="text-primary" style={{ fontWeight: "500" }}>
            + R50 Monthly
          </small>
        </span>
        <p className="h4 fw-bold mt-4 mb-2">{selectedPackage.name || "Standard Package"}</p>
        <p className="text-muted mb-3">{selectedPackage.description}</p>
        <ul
          className="list-unstyled text-start px-3"
          style={{ fontSize: "0.95rem", color: "#555", lineHeight: 1.5 }}
        >
          {selectedPackage.features?.map((feature, idx) => (
            <li key={idx} className="d-flex align-items-center mb-2">
              <FaCheck
                size={14}
                style={{ color: "#0071e3", marginRight: "0.5rem" }}
              />
              {feature}
            </li>
          ))}
        </ul>
      </Card>

      {/* Pet Selection */}
      <div className="mb-4" style={{ maxWidth: "600px", margin: "auto" }}>
        <h5 className="mb-3 fw-semibold" style={{ fontSize: "1.3rem", color: "#222" }}>
          Select Pets for Tag Order
        </h5>
        <ListGroup style={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 12px rgb(0 0 0 / 0.1)" }}>
          {pets.map((pet) => (
            <ListGroup.Item
              key={pet._id}
              action
              onClick={() => handlePetSelection(pet)}
              active={selectedPets.includes(pet._id)}
              className="d-flex justify-content-between align-items-center"
              style={{
                cursor: "pointer",
                fontWeight: selectedPets.includes(pet._id) ? "600" : "400",
                fontSize: "1rem",
                transition: "background-color 0.2s ease",
                border: "none",
                borderBottom: "1px solid #eee",
              }}
            >
              <span>
                {pet.name} <small className="text-muted">({pet.species})</small>
              </span>
              <Form.Check
                type="checkbox"
                checked={selectedPets.includes(pet._id)}
                onChange={() => handlePetSelection(pet)}
                onClick={(e) => e.stopPropagation()}
                style={{ transform: "scale(1.2)" }}
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
              R{(selectedPackage.price * selectedPets.length).toFixed(2)}
            </span>
          </h5>
        </Col>
        <Col xs={12} md={6} className="text-md-end">
          <Button
            onClick={handleContinue}
            className="px-4 py-2"
            style={{
              borderRadius: "30px",
              fontWeight: "600",
              fontSize: "1.1rem",
              backgroundColor: "#0071e3",
              borderColor: "#0071e3",
              boxShadow: "0 6px 15px rgb(0 113 227 / 0.3)",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005bb5")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0071e3")}
          >
            Continue
          </Button>
        </Col>
      </Row>

      {/* Toast */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg="warning"
          style={{ borderRadius: "12px" }}
        >
          <Toast.Header closeButton={true}>
            <strong className="me-auto">Selection Required</strong>
          </Toast.Header>
          <Toast.Body>Please select at least one pet before continuing.</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}

export default SelectTagPage;
