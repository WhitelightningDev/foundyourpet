import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Spinner,
} from "react-bootstrap";

function ProfilePage() {
  const [userData, setUserData] = useState({
    name: "",
    surname: "",
    contact: "",
    email: "",
    password: "",
    address: {
      street: "",
      city: "",
      province: "",
      postalCode: "",
      country: "",
    },
  });

  const [originalData, setOriginalData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      const userProfile = {
        name: storedUser.name || "",
        surname: storedUser.surname || "",
        contact: storedUser.contact || "",
        email: storedUser.email || "",
        password: "",
        address: {
          street: storedUser.address?.street || "",
          city: storedUser.address?.city || "",
          province: storedUser.address?.province || "",
          postalCode: storedUser.address?.postalCode || "",
          country: storedUser.address?.country || "",
        },
      };
      setUserData(userProfile);
      setOriginalData(userProfile);
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setUserData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Check if the country is provided before submitting
    if (!userData.address.country.trim()) {
      alert("Please include a country in your address.");
      return;
    }

    // Prepare the payload, only including the password if it's not empty
    const payload = {
      ...userData,
    };
    if (userData.password.trim() === "") {
      delete payload.password; // Don't send password if empty
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        `https://foundyourpet-backend.onrender.com/api/users/${userId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Profile updated successfully");
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setIsEditing(false);
      setOriginalData(userData);
    } catch (error) {
      alert("Failed to update profile");
      console.error(error);
    }
  };

  const handleCancel = () => {
    setUserData(originalData);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "60vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="my-5">
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">User Profile</h4>
          {!isEditing ? (
            <Button
              variant="outline-primary"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          ) : (
            <div className="d-flex gap-2">
              <Button variant="success" onClick={handleUpdate}>
                Save Changes
              </Button>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </Card.Header>

        <Card.Body>
          <Form onSubmit={handleUpdate}>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={userData.name}
                    readOnly
                    plaintext
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formSurname">
                  <Form.Label>Surname</Form.Label>
                  <Form.Control
                    type="text"
                    name="surname"
                    value={userData.surname}
                    readOnly
                    plaintext
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <Form.Group controlId="formContact">
                  <Form.Label>Contact</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact"
                    value={userData.contact}
                    onChange={handleChange}
                    placeholder="Enter contact"
                    disabled={!isEditing}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    disabled={!isEditing}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="formPassword" className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter new password"
                value={userData.password}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Form.Text muted>
                Leave blank if you don’t want to change your password.
              </Form.Text>
            </Form.Group>

            <h5 className="mb-3">Address Information</h5>

            <Row className="mb-3">
              <Col md={12}>
                <Form.Group controlId="formStreet">
                  <Form.Label>Street</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.street"
                    value={userData.address.street}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formCity">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.city"
                    value={userData.address.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formProvince">
                  <Form.Label>Province</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.province"
                    value={userData.address.province}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <Form.Group controlId="formPostalCode">
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.postalCode"
                    value={userData.address.postalCode}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formCountry">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.country"
                    value={userData.address.country}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ProfilePage;
