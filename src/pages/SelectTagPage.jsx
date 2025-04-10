import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Modal } from "react-bootstrap";

const packages = {
  standard: {
    name: "Standard Tag",
    basePrice: 99.99,
    options: [
      { label: "Circle Tag (Engraved QR)", price: 0 },
      { label: "Bone Tag (Engraved QR)", price: 10 },
    ]
  },
  samsung: {
    name: "Samsung Smart Tag",
    basePrice: 349.99,
    options: [
      { label: "Leather SmartTag Holder", price: 79.99 }
    ]
  },
  apple: {
    name: "Apple AirTag",
    basePrice: 499.99,
    options: [
      { label: "Silicone AirTag Collar", price: 129.99 },
      { label: "Leather AirTag Collar", price: 199.99 }
    ]
  }
};

function SelectTagPage() {
  const { tagType } = useParams();
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [total, setTotal] = useState(0);
  const [includeMembership, setIncludeMembership] = useState(false);

  const selectedPackage = packages[tagType];

  useEffect(() => {
    setTotal(selectedPackage.basePrice);
  }, [tagType]);

  const handleOptionSelect = (price) => {
    setTotal(selectedPackage.basePrice + price);
    setSelectedOption(price);
  };

  const handleContinue = () => {
    setShowModal(true);
  };

  const handleModalChoice = (choice) => {
    const finalPrice = choice ? total + 49.99 : total;
    navigate("/checkout", {
      state: {
        package: selectedPackage.name,
        total: finalPrice,
        membership: choice
      }
    });
  };

  return (
    <Container className="my-5">
      <h3 className="mb-4 text-center">Customize Your {selectedPackage.name}</h3>
      <Card className="shadow-sm p-4">
        <p><strong>Base Price:</strong> R{selectedPackage.basePrice.toFixed(2)}</p>
        <p><strong>Choose an Add-on:</strong></p>
        <Form>
          {selectedPackage.options.map((opt, idx) => (
            <Form.Check
              key={idx}
              type="radio"
              name="addon"
              label={`${opt.label} (+R${opt.price})`}
              onChange={() => handleOptionSelect(opt.price)}
            />
          ))}
        </Form>
        <h5 className="mt-4">Total: R{total.toFixed(2)}</h5>
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
