import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/SelectTag.css";
import "../styles/infocard.css";
import { FaCheck } from "react-icons/fa";
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
import axios from "axios";

function SelectTagPage() {
  const { tagType } = useParams();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: "", surname: "" });
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
        setUser({
          name: response.data.name,
          surname: response.data.surname,
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
      .map((pet) => ({ ...pet }));

    navigate("/checkout", {
      state: {
        package: selectedPackage.name,
        total: finalPrice,
        membership: true,
        selectedPets: selectedPetDetails,
      },
    });
  };

  if (loading || !selectedPackage) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container fluid="md" className="my-5 px-3">
      <h2 className="border-bottom text-center mb-4">Great Stuff {user.name}</h2>

      {/* Info Card */}
      <div className="infocard mb-4">
      

        <div className="icon-container">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="icon"
          >
            <path d="M13 7.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-3 3.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v4.25h.75a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5h.75V12h-.75a.75.75 0 0 1-.75-.75Z"></path>
            <path d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1ZM2.5 12a9.5 9.5 0 0 0 19 0 9.5 9.5 0 0 0-19 0Z"></path>
          </svg>
        </div>
        <div className="message-text-container">
          <p className="message-text">Please Note</p>
          <p className="sub-text">Make sure you have added all your pets before purchasing tags</p>
        </div>
      </div>

      {/* Package Card */}
      <Card className="plan shadow border-0 mx-auto mb-4 w-100">
        <div className="inner text-center">
          <span className="pricing">
            <span className="text-primary">
              R{selectedPackage.price.toFixed(2)} Initial{" "}
              <small className="text-primary">+ R50 Monthly</small>
            </span>
          </span>
          <p className="title mt-5">{selectedPackage.name || "Standard Package"}</p>
          <p className="info">{selectedPackage.description}</p>
          <ul className="features text-start px-3">
            {selectedPackage.features?.map((feature, idx) => (
              <li key={idx}>
                <span className="icon">
                  <FaCheck size={12} />
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* Pet Selection */}
      <div className="mb-4">
        <h5 className="mb-3">Select Pets for Tag Order</h5>
        <ListGroup>
          {pets.map((pet) => (
            <ListGroup.Item
              key={pet._id}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{pet.name}</strong> ({pet.species})
              </div>
              <Form.Check
                type="checkbox"
                checked={selectedPets.includes(pet._id)}
                onChange={() => handlePetSelection(pet)}
              />
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>

      {/* Total and Continue */}
      <Row className="mt-4">
        <Col xs={12} md={6} className="mb-3 mb-md-0">
          <h5>
            <strong>Total:</strong> R
            {(selectedPackage.price * selectedPets.length).toFixed(2)}
          </h5>
        </Col>
        <Col xs={12} md={6} className="text-md-end">
          <Button className="px-4 w-100 w-md-auto" onClick={handleContinue}>
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
        >
          <Toast.Header>
            <strong className="me-auto">Selection Required</strong>
          </Toast.Header>
          <Toast.Body>Please select at least one pet before continuing.</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}

export default SelectTagPage;
