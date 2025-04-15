import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Card, Row, Col, Badge } from "react-bootstrap";
import { QRCodeCanvas } from "qrcode.react";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "https://foundyourpet-backend.onrender.com/api/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleViewDetails = async (userId) => {
    try {
      const res = await axios.get(
        `https://foundyourpet-backend.onrender.com/api/users/users/${userId}/with-pets`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedUser(res.data.user);
      setPets(res.data.pets);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("Failed to fetch user details");
    }
  };

  const handleDownloadQRCodeAsDXF = async (petId, value) => {
    try {
      // Generate QR matrix
      const qrData = await QRCode.create(value, { errorCorrectionLevel: "H" });
      const modules = qrData.modules;
      const size = modules.size;
      const data = modules.data;

      let dxfContent = "0\nSECTION\n2\nENTITIES\n";

      const scale = 10;
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          if (data[y * size + x]) {
            const x1 = x * scale;
            const y1 = y * scale;
            const x2 = x1 + scale;
            const y2 = y1 + scale;

            dxfContent += `
  0
  LWPOLYLINE
  8
  QR
  90
  4
  70
  1
  10
  ${x1}
  20
  ${y1}
  10
  ${x2}
  20
  ${y1}
  10
  ${x2}
  20
  ${y2}
  10
  ${x1}
  20
  ${y2}
  10
  ${x1}
  20
  ${y1}
  `;
          }
        }
      }

      dxfContent += "0\nENDSEC\n0\nEOF";

      const blob = new Blob([dxfContent], { type: "application/dxf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${petId}_qr.dxf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate DXF QR code", error);
    }
  };

  const handleDownloadQRCode = (petId) => {
    const canvas = document.getElementById(`qr-${petId}`);
    const pngDataUrl = canvas.toDataURL("image/png");

    // Download PNG
    const downloadLink = document.createElement("a");
    downloadLink.href = pngDataUrl;
    downloadLink.download = `${petId}_qr.png`;
    downloadLink.click();

    // Download PDF
    const pdf = new jsPDF();
    pdf.text("Found Your Pet - QR Code", 20, 20);
    pdf.addImage(pngDataUrl, "PNG", 15, 30, 180, 180); // adjust size/position as needed
    pdf.save(`${petId}_qr.pdf`);
  };

  const handleDownloadQRCodeAsPDF = (petId) => {
    const canvas = document.getElementById(`qr-${petId}`);
    const pngDataUrl = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.text("Found Your Pet - QR Code", 20, 20);
    pdf.addImage(pngDataUrl, "PNG", 15, 30, 180, 180);
    pdf.save(`${petId}_qr.pdf`);
  };

  if (loading) return <div className="container mt-5">Loading users...</div>;
  if (error) return <div className="container mt-5 text-danger">{error}</div>;

  const adminUsers = users.filter((user) => user.isAdmin);
  const regularUsers = users.filter((user) => !user.isAdmin);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Admin Dashboard</h2>
      <p>Total users: {users.length}</p>

      <Row>
        {/* Admin Users */}
        <Col sm={12} md={6}>
          <h4 className="mb-3">Admin Users</h4>
          <div className="list-group">
            {adminUsers.map((user) => (
              <Card key={user._id} className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>
                        {user.name} {user.surname}
                      </strong>
                      <br />
                      <span className="text-muted">{user.email}</span>
                    </div>
                    <Badge className="bg-success" pill variant="success">
                      Admin
                    </Badge>
                  </div>
                  <Button
                    variant="outline-primary"
                    className="mt-3"
                    onClick={() => handleViewDetails(user._id)}
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Col>

        {/* Regular Users */}
        <Col sm={12} md={6}>
          <h4 className="mb-3">Regular Users</h4>
          <div className="list-group">
            {regularUsers.map((user) => (
              <Card key={user._id} className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>
                        {user.name} {user.surname}
                      </strong>
                      <br />
                      <span className="text-muted">{user.email}</span>
                    </div>
                    <Badge pill variant="secondary">
                      User
                    </Badge>
                  </div>
                  <Button
                    variant="outline-primary"
                    className="mt-3"
                    onClick={() => handleViewDetails(user._id)}
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Col>
      </Row>

      {/* Modal to show user details and pets */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>User Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              {/* User Profile */}
              <Card className="mb-3">
                <Card.Body>
                  <h5 className="text-success border-bottom">
                    {selectedUser.name} {selectedUser.surname}
                  </h5>
                  <p>
                    <strong className="text-secondary">Email:</strong>{" "}
                    {selectedUser.email}
                  </p>
                  <p>
                    <strong className="text-secondary">Contact:</strong>{" "}
                    {selectedUser.contact}
                  </p>
                  <p>
                    <strong className="text-secondary">Address:</strong>{" "}
                    {selectedUser.address?.street}, {selectedUser.address?.city}
                  </p>
                </Card.Body>
              </Card>

              {/* Pets Section */}
              <h5 className="text-primary mb-3">
                <strong>Pets:</strong>
              </h5>
              {pets.length === 0 ? (
                <p className="text-muted">No pets found.</p>
              ) : (
                pets.map((pet) => (
                  <Card key={pet._id} className="mb-4 shadow-sm border-0">
                    <Card.Body>
                      <Row className="mb-3">
                        <Col xs={12} md={6}>
                          <h6 className="text-primary border-bottom pb-1 mb-2">
                            <strong>Pet Details</strong>
                          </h6>
                          <p>
                            <strong className="text-secondary">Name:</strong>{" "}
                            {pet.name}
                          </p>
                          <p>
                            <strong className="text-secondary">Species:</strong>{" "}
                            {pet.species}
                          </p>
                          <p>
                            <strong className="text-secondary">Breed:</strong>{" "}
                            {pet.breed}
                          </p>
                          <p>
                            <strong className="text-secondary">Age:</strong>{" "}
                            {pet.age} years
                          </p>
                          <p>
                            <strong className="text-secondary">Gender:</strong>{" "}
                            {pet.gender}
                          </p>
                        </Col>
                        <Col xs={12} md={6}>
                          <h6 className="text-primary border-bottom pb-1 mb-2">
                            <strong>Health Information</strong>
                          </h6>
                          <p>
                            <strong className="text-secondary">
                              Microchip:
                            </strong>{" "}
                            {pet.microchipNumber || "N/A"}
                          </p>
                          <p>
                            <strong className="text-secondary">
                              Spayed | Neutered:
                            </strong>{" "}
                            {pet.spayedNeutered ? "Yes" : "No"}
                          </p>
                        </Col>
                      </Row>

                      <Row className="mb-3">
                        <Col xs={12} md={6}>
                          <h6 className="text-primary border-bottom pb-1 mb-2">
                            <strong>Tag Information</strong>
                          </h6>
                          <p>
                            <strong className="text-secondary">
                              Tag Type:
                            </strong>{" "}
                            {pet.tagType || "N/A"}
                          </p>
                        </Col>
                        <Col xs={12} md={6}>
                          <h6 className="text-primary border-bottom pb-1 mb-2">
                            <strong>Vet & Insurance</strong>
                          </h6>
                          <p>
                            <strong className="text-secondary">
                              Vet Info:
                            </strong>{" "}
                            {pet.vetInfo || "N/A"}
                          </p>
                          <p>
                            <strong className="text-secondary">
                              Insurance Info:
                            </strong>{" "}
                            {pet.insuranceInfo || "N/A"}
                          </p>
                        </Col>
                      </Row>

                      {/* QR Code Generation & Download */}
                      <Row>
                        <Col>
                          <Button
                            variant="outline-success"
                            onClick={() => {
                              handleDownloadQRCode(pet._id);
                            }}
                          >
                            Download QR Code
                          </Button>

                          <QRCodeCanvas
                            id={`qr-${pet._id}`}
                            value={`https://foundyourpet.vercel.app/pet-profile/${pet._id}`}
                            size={200}
                            level="H"
                            includeMargin={true}
                            className="hidden"
                          />
                        </Col>
                        <Button
                          variant="outline-danger"
                          onClick={() => {
                            handleDownloadQRCodeAsPDF(pet._id);
                          }}
                        >
                          Download QR as PDF
                        </Button>
                        <Button
                          variant="outline-dark"
                          onClick={() =>
                            handleDownloadQRCodeAsDXF(
                              pet._id,
                              `https://foundyourpet.vercel.app/pet-profile/${pet._id}`
                            )
                          }
                        >
                          Download QR as DXF
                        </Button>
                      </Row>
                    </Card.Body>
                  </Card>
                ))
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminDashboard;
