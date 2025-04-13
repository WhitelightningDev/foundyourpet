import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button, Form, Modal, Spinner, Row, Col, Toast, ToastContainer } from "react-bootstrap";
import axios from "axios";

function SelectTagPage() {
  const { tagType } = useParams();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [addons, setAddons] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: "", surname: "" });
  const [pets, setPets] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [selectedPets, setSelectedPets] = useState([]);
  const [selectedPetSizes, setSelectedPetSizes] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    async function fetchData() {
      try {
        const [pkgRes, addonRes, petRes] = await Promise.all([
          axios.get(`https://foundyourpet-backend.onrender.com/api/packages/type/${tagType}`),
          axios.get(`https://foundyourpet-backend.onrender.com/api/addons/filter?type=${tagType}`),
          axios.get("https://foundyourpet-backend.onrender.com/api/pets", {
            headers: { Authorization: `Bearer ${token}` },
          })
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
        const response = await axios.get("https://foundyourpet-backend.onrender.com/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  const handleAddonToggle = (addon) => {
    const isSelected = selectedAddons.some((a) => a._id === addon._id);
    if (isSelected) {
      setSelectedAddons(selectedAddons.filter((a) => a._id !== addon._id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handlePetSelection = (pet) => {
    setSelectedPets((prev) => {
      if (prev.includes(pet._id)) {
        return prev.filter((id) => id !== pet._id);
      } else {
        return [...prev, pet._id];
      }
    });
  };

  const handleSizeSelection = (petId, size) => {
    setSelectedPetSizes((prev) => ({
      ...prev,
      [petId]: size,
    }));
  };

  const handleContinue = () => {
    if (selectedPets.length === 0) {
      setShowToast(true);
      return;
    }

    const base = selectedPackage?.price || 0;
    const addonTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    const petTotal = selectedPets.length * base;
    const finalPrice = petTotal + addonTotal;

    const selectedPetDetails = pets
      .filter((pet) => selectedPets.includes(pet._id))
      .map((pet) => ({
        ...pet,
        size: selectedPetSizes[pet._id],
      }));

    navigate("/checkout", {
      state: {
        package: selectedPackage.name,
        total: finalPrice,
        membership: true,
        selectedAddons: selectedAddons.map((a) => ({ name: a.name, price: a.price })),
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

  const addonTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);

  return (
    <Container className="my-5">
      <h2 className="border-bottom text-center mb-5">Great Stuff {user.name}</h2>
      <h3 className="mb-4 text-center">
        <strong>{selectedPackage.name}</strong>
      </h3>

      {/* Package Details Card */}
      <Card className="shadow-lg p-4 border-0 mb-4 text-center">
        <h2 className="text-success mb-3">
          <strong>Price:</strong> R{selectedPackage.price.toFixed(2)}
        </h2>

        <h5 className="mb-3 text-light p-3 text-center text-bg-secondary rounded-3">
          <strong>What's Included</strong>
        </h5>
        <ul className="ps-3">
          {selectedPackage.features?.map((feature, idx) => (
            <li key={idx} className="mb-1 text-start">{feature}</li>
          ))}
        </ul>
      </Card>

      <h3 className="text-center mb-4 border-bottom">Now select optional add-ons, and select the pets that you would like tags for</h3>

      {/* Pet Selection and Add-ons */}
      <Row className="mb-4">
        {pets.map((pet, idx) => (
          <Col key={pet._id} sm={12} md={6} lg={4} className="mb-3">
            <Card className="p-3 shadow-sm border-0">
              <Card.Body>
                <h5 className="text-center mb-3">{pet.name} ({pet.species})</h5>
                
                <Form.Check
                  type="checkbox"
                  label="Select this pet"
                  checked={selectedPets.includes(pet._id)}
                  onChange={() => handlePetSelection(pet)}
                  className="mb-3"
                />

                {selectedPets.includes(pet._id) && (
                  <div>
                    <h6>Select Size</h6>
                    <Form.Check
                      inline
                      type="radio"
                      label="Small"
                      name={`size-${pet._id}`}
                      checked={selectedPetSizes[pet._id] === "small"}
                      onChange={() => handleSizeSelection(pet._id, "small")}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Medium"
                      name={`size-${pet._id}`}
                      checked={selectedPetSizes[pet._id] === "medium"}
                      onChange={() => handleSizeSelection(pet._id, "medium")}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Large"
                      name={`size-${pet._id}`}
                      checked={selectedPetSizes[pet._id] === "large"}
                      onChange={() => handleSizeSelection(pet._id, "large")}
                    />

                    <h6 className="mt-3">Select Add-ons</h6>
                    {addons.map((addon, idx) => (
                      <Form.Check
                        key={idx}
                        type="checkbox"
                        label={`${addon.name} (+R${addon.price})`}
                        checked={selectedAddons.some((a) => a._id === addon._id)}
                        onChange={() => handleAddonToggle(addon)}
                        className="mb-2"
                      />
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Total and Continue */}
      <div className="mt-4 d-flex justify-content-between align-items-center">
        <h5>
          <strong>Total:</strong> R{(selectedPackage.price * selectedPets.length + addonTotal).toFixed(2)}
        </h5>
        <Button className="px-4" onClick={handleContinue}>Continue</Button>
      </div>

      {/* Toast */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg="warning">
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
