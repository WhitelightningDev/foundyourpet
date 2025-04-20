import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Card, Row, Col, Badge } from "react-bootstrap";
import { QRCodeCanvas } from "qrcode.react";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { FaFilePdf, FaQrcode, FaDownload } from "react-icons/fa";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
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

  const handleShowQRModal = (pet) => {
    setSelectedPet(pet);
    setShowQRModal(true);
  };

  const handleDownloadQRCode = (petId) => {
    const canvas = document.getElementById(`qr-${petId}`);
    const pngDataUrl = canvas.toDataURL("image/png");

    const downloadLink = document.createElement("a");
    downloadLink.href = pngDataUrl;
    downloadLink.download = `${petId}_qr.png`;
    downloadLink.click();

    const pdf = new jsPDF();
    pdf.text("Found Your Pet - QR Code", 20, 20);
    pdf.addImage(pngDataUrl, "PNG", 15, 30, 180, 180);
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

  const handleDownloadQRCodeAsDXF = async (petId, value) => {
    try {
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
    } catch (err) {
      console.error("Failed to generate DXF QR code", err);
    }
  };

  if (loading) return <div className="container mt-5">Loading users...</div>;
  if (error) return <div className="container mt-5 text-danger">{error}</div>;

  const adminUsers = users.filter((user) => user.isAdmin);
  const regularUsers = users.filter((user) => !user.isAdmin);

  return (
    <div className="container mt-5">
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="mb-1">Admin Dashboard</h3>
              <p className="text-muted mb-0">Overview of registered users and their pets</p>
            </div>
            <h5 className="text-primary">Total Users: {users.length}</h5>
          </div>
        </Card.Body>
      </Card>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Admin Users</h5>
            </Card.Header>
            <Card.Body className="p-3">
              {adminUsers.map((user) => (
                <Card key={user._id} className="mb-3 border-light">
                  <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">
                        <strong>{user.name} {user.surname}</strong>
                      </h6>
                      <small className="text-muted">{user.email}</small>
                    </div>
                    <div className="text-end">
                      <Badge bg="success" pill className="mb-2 px-3 py-1">Admin</Badge>
                      <Button size="sm" variant="outline-primary" onClick={() => handleViewDetails(user._id)}>
                        View
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Regular Users</h5>
            </Card.Header>
            <Card.Body className="p-3">
              {regularUsers.map((user) => (
                <Card key={user._id} className="mb-3 border-light">
                  <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">
                        <strong>{user.name} {user.surname}</strong>
                      </h6>
                      <small>{user.email}</small>
                    </div>
                    <div className="text-end">
                      <Badge bg="secondary" pill className="mb-2 px-3 py-1">User</Badge>
                      <Button size="sm" variant="outline-primary" onClick={() => handleViewDetails(user._id)}>
                        View
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal for User Profile */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>User Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Row>
              <Col md={4}>
                <Card className="mb-4 border-2 mt-5 shadow-sm">
                  <Card.Body>
                    <h5 className="text-success">
                      {selectedUser.name} {selectedUser.surname}
                    </h5>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Contact:</strong> {selectedUser.contact}</p>
                    <p><strong>Address:</strong> {selectedUser.address?.street}, {selectedUser.address?.city}</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={8}>
                <h4 className="text-primary border-bottom mb-3 text-center">Pets</h4>
                {pets.length === 0 ? (
                  <p className="text-muted">No pets found.</p>
                ) : (
                  pets.map((pet) => (
                    <Card key={pet._id} className="mb-4 border-2">
                      <Card.Body className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5>{pet.name}</h5>
                          <p className="text-muted">{pet.species} - {pet.breed}</p>
                        </div>
                        <div className="text-end">
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleShowQRModal(pet)}
                          >
                            <FaQrcode /> QR Code
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  ))
                )}
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for QR Code */}
      <Modal show={showQRModal} onHide={() => setShowQRModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>QR Code for {selectedPet?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <QRCodeCanvas
              id={`qr-${selectedPet?._id}`}
              value={selectedPet?.qrCodeValue || ""}
              size={256}
            />
          </div>
          <div className="text-center mt-3">
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleDownloadQRCode(selectedPet?._id)}
              className="me-2"
            >
              <FaFilePdf /> Download PDF
            </Button>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleDownloadQRCodeAsDXF(selectedPet?._id, selectedPet?.qrCodeValue)}
            >
              <FaDownload /> Download DXF
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AdminDashboard;
