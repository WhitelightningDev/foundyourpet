import React, { useContext, useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";

function ProfilePage() {
  const navigate = useNavigate();
  const { user, token, loading: authLoading, updateUser } = useContext(AuthContext);

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

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      navigate("/login", { replace: true });
      return;
    }

    const userProfile = {
      name: user.name || "",
      surname: user.surname || "",
      contact: user.contact || "",
      email: user.email || "",
      password: "",
      address: {
        street: user.address?.street || "",
        city: user.address?.city || "",
        province: user.address?.province || "",
        postalCode: user.address?.postalCode || "",
        country: user.address?.country || "",
      },
    };
    setUserData(userProfile);
    setOriginalData(userProfile);
    setLoading(false);
  }, [authLoading, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setUserData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [key]: value,
        },
      }));
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!userData.address.country.trim()) {
      alert("Please include a country in your address.");
      return;
    }

    const payload = { ...userData };
    if (!userData.password.trim()) {
      delete payload.password;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/users/${user?._id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Profile updated successfully");
      updateUser(response.data.user);
      setOriginalData(userData);
      setIsEditing(false);
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
      <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="my-5">
      <Card className="shadow-lg">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Profile Details</h4>
          {!isEditing ? (
            <Button variant="outline-primary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          ) : (
            <div className="d-flex gap-2">
              <Button variant="success" type="submit" onClick={handleUpdate}>
                Save
              </Button>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </Card.Header>

        <Card.Body>
          <Form onSubmit={handleUpdate}>
            <h5 className="mb-3 text-muted">Basic Information</h5>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formName">
                  <Form.Label>First Name</Form.Label>
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
                  <Form.Label>Last Name</Form.Label>
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

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formContact">
                  <Form.Label>Contact</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact"
                    value={userData.contact}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Enter phone number"
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
                    disabled={!isEditing}
                    placeholder="Enter email"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="formPassword" className="mb-4">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Leave blank to keep current password"
                value={userData.password}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Form.Text className="text-muted">
                Leave blank if you do not wish to change your password.
              </Form.Text>
            </Form.Group>

            <h5 className="mb-3 text-muted">Address Details</h5>

            <Form.Group controlId="formStreet" className="mb-3">
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

            <Row>
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
