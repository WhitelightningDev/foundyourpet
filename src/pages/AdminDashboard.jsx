import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Card, Row, Col, Badge, Table } from "react-bootstrap";
import UserProfileModal from "../components/UserProfileModal";
import QRCodeModal from "../components/QRCodeModal";
import { jsPDF } from "jspdf"; // For PDF generation
import { QRCodeCanvas } from "qrcode.react"; // For QR code generation
import QRCode from "qrcode"; // Add this line

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [showModal, setShowModal] = useState(false);
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
      } catch (err) {
        console.error("Error fetching users:", err);
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

            dxfContent += `0
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

  const adminUsers = users.filter((user) => user.isAdmin);
  const regularUsers = users.filter((user) => !user.isAdmin);

  return (
    <div className="container mt-5">
      {/* Dashboard Overview Card */}
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

      {/* Admin Users and Regular Users Cards */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-primary">
              <h5 className="mb-0 text-white">Admin Users</h5>
            </Card.Header>
            <Card.Body className="p-3">
              <Table responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name} {user.surname}</td>
                      <td>{user.email}</td>
                      <td>
                        <Badge bg="success" pill>Admin</Badge>
                      </td>
                      <td>
                        <Button size="sm" variant="outline-primary" onClick={() => handleViewDetails(user._id)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Regular Users</h5>
            </Card.Header>
            <Card.Body className="p-3">
              <Table responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {regularUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name} {user.surname}</td>
                      <td>{user.email}</td>
                      <td>
                        <Badge bg="info" pill>User</Badge>
                      </td>
                      <td>
                        <Button size="sm" variant="outline-primary" onClick={() => handleViewDetails(user._id)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modals for Viewing Details and QR Code */}
      <UserProfileModal
        showModal={showModal}
        handleClose={() => setShowModal(false)}
        selectedUser={selectedUser}
        pets={pets}
        handleShowQRModal={handleShowQRModal}
      />
      <QRCodeModal
        showQRModal={showQRModal}
        handleClose={() => setShowQRModal(false)}
        selectedPet={selectedPet}
        handleDownloadQRCode={handleDownloadQRCode}
        handleDownloadQRCodeAsDXF={handleDownloadQRCodeAsDXF}
      />
    </div>
  );
}

export default AdminDashboard;
