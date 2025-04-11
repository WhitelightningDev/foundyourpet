import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button, Form, Modal, Spinner } from "react-bootstrap";
import axios from "axios";

function SelectTagPage() {
  const { tagType } = useParams();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [addons, setAddons] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [pkgRes, addonRes] = await Promise.all([
          axios.get(`https://foundyourpet-backend.onrender.com/api/packages/type/${tagType}`),
          axios.get(`https://foundyourpet-backend.onrender.com/api/addons/filter?type=${tagType}`)
        ]);
        setSelectedPackage(pkgRes.data);
        setAddons(addonRes.data);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

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

  const handleContinue = () => setShowModal(true);

  const handleModalChoice = (choice) => {
    const base = selectedPackage?.basePrice || 0;
    const addonTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    const finalPrice = choice ? base + addonTotal + 49.99 : base + addonTotal;

    navigate("/checkout", {
      state: {
        package: selectedPackage.name,
        total: finalPrice,
        membership: choice,
        selectedAddons: selectedAddons.map(a => ({ name: a.name, price: a.price }))
      }
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
      <h3 className="mb-4 text-center">Customize Your {selectedPackage.name}</h3>
      <Card className="shadow-sm p-4">
        <p><strong>Base Price:</strong> R{selectedPackage.basePrice.toFixed(2)}</p>
        <p><strong>Select Add-ons:</strong></p>
        <Form>
          {addons.map((addon, idx) => (
            <Form.Check
              key={idx}
              type="checkbox"
              label={`${addon.name} (+R${addon.price})`}
              checked={selectedAddons.some((a) => a._id === addon._id)}
              onChange={() => handleAddonToggle(addon)}
            />
          ))}
        </Form>
        <h5 className="mt-4">
          Total: R{(selectedPackage.basePrice + addonTotal).toFixed(2)}
        </h5>
        <Button className="mt-3 w-100" onClick={handleContinue}>Continue</Button>
      </Card>

      {/* Membership Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Join Support Membership?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Add monthly pet protection support for R49.99/month:
          <ul className="small mt-2">
            <li>📞 24/7 lost pet support</li>
            <li>🔁 Free tag replacement</li>
            <li>🚨 Instant lost alerts</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleModalChoice(false)}>No Thanks</Button>
          <Button variant="info" onClick={() => handleModalChoice(true)}>Yes, Add Support</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default SelectTagPage;
