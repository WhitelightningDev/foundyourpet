import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/SelectTag.css";
import "../styles/infocard.css";
import {
  FaPaw,
  FaDog,
  FaCat,
  FaPlus,
  FaEdit,
  FaCheck,
  FaTrash,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  Container,
  Card,
  Button,
  Form,
  Modal,
  Spinner,
  ListGroup,
  Row,
  Col,
  Toast,
  ToastContainer,
} from "react-bootstrap";
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
        selectedAddons: selectedAddons.map((a) => ({
          name: a.name,
          price: a.price,
        })),
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
      <h2 className="border-bottom text-center mb-5">
        Great Stuff {user.name}
      </h2>
      <div className="infocard mb-5">
        <svg
          class="wave"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z"
            fill-opacity="1"
          ></path>
        </svg>

        <div class="icon-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke-width="0"
            fill="currentColor"
            stroke="currentColor"
            class="icon"
          >
            <path d="M13 7.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-3 3.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v4.25h.75a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5h.75V12h-.75a.75.75 0 0 1-.75-.75Z"></path>
            <path d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1ZM2.5 12a9.5 9.5 0 0 0 9.5 9.5 9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 12 2.5 9.5 9.5 0 0 0 2.5 12Z"></path>
          </svg>
        </div>
        <div class="message-text-container">
          <p class="message-text">Please Note</p>
          <p class="sub-text"> Make sure you have added all your pets before purchasing tags</p>
        </div>
       
      </div>

      

      {/* Package Details Card */}
      <Card className="plan shadow border-0 mx-auto my-4">
        <div className="inner">
          {/* Price badge */}
          <span className="pricing">
            <span>
              R{selectedPackage.price.toFixed(2)} <small> once-off + R50 Monthly</small>
            </span>
          </span>

          {/* Title and Info */}
          <p className="title">{selectedPackage.name || "Standard Package"}</p>
          <p className="info">
            {selectedPackage.description ||
              "Includes engraved tag, delivery, and access to support benefits."}
          </p>

          {/* Feature List */}
          <ul className="features">
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

      <h3 className="text-center mb-4 border-bottom">
        Now select optional add-ons, and select the pets that you would like
        tags for
      </h3>

      {/* Pet Selection and Add-ons (List View) */}
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
      <div className="mt-4 d-flex justify-content-between align-items-center">
        <h5>
          <strong>Total:</strong> R
          {(selectedPackage.price * selectedPets.length + addonTotal).toFixed(
            2
          )}
        </h5>
        <Button className="px-4" onClick={handleContinue}>
          Continue
        </Button>
      </div>

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
          <Toast.Body>
            Please select at least one pet before continuing.
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}

export default SelectTagPage;
