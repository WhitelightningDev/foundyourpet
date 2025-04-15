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

  const handleShowQRModal = (pet) => {
  setSelectedPet(pet);
  setShowQRModal(true);
};

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
      <h3 className="mb-3">Admin Dashboard</h3>
      <p className="text-muted">Total users: {users.length}</p>
  
      <Row>
        {/* Admin Users */}
        <Col sm={12} md={6}>
          <h5 className="mb-3">Admin Users</h5>
          {adminUsers.map((user) => (
            <Card key={user._id} className="mb-3 shadow-sm border-0">
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">{user.name} {user.surname}</h6>
                  <small className="text-muted">{user.email}</small>
                </div>
                <div className="text-end">
                  <Badge bg="success" pill className="mb-2">Admin</Badge>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => handleViewDetails(user._id)}
                  >
                    View
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </Col>
  
        {/* Regular Users */}
        <Col sm={12} md={6}>
          <h5 className="mb-3">Regular Users</h5>
          {regularUsers.map((user) => (
            <Card key={user._id} className="mb-3 shadow-sm border-2">
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1 border-bottom">{user.name} {user.surname}</h6>
                  <small className="text-black">{user.email}</small>
                </div>
                <div className="text-end">
                  <Badge bg="secondary" style={{width: "100px"}} pill className="mb-2 m-2 p-2"> User </Badge>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => handleViewDetails(user._id)}
                  >
                    View
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
  
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered>
  <Modal.Header closeButton>
    <Modal.Title>User Profile</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedUser && (
      <Row>
        {/* Left Column: User Info */}
        <Col md={4}>
          <Card className="mb-4 border-2 mt-5 shadow-sm">
            <Card.Body>
              <h5 className="text-success">
                {selectedUser.name} {selectedUser.surname}
              </h5>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Contact:</strong> {selectedUser.contact}</p>
              <p>
                <strong>Address:</strong>{" "}
                {selectedUser.address?.street}, {selectedUser.address?.city}
              </p>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column: Pets */}
        <Col md={8}>
          <h4 className="text-primary border-bottom mb-3 text-center">Pets</h4>
          {pets.length === 0 ? (
            <p className="text-muted">No pets found.</p>
          ) : (
            pets.map((pet) => (
              <Card key={pet._id} className="mb-4 border-2 shadow-sm">
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <h6 className="text-primary">Pet Details</h6>
                      <p><strong>Name:</strong> {pet.name}</p>
                      <p><strong>Species:</strong> {pet.species}</p>
                      <p><strong>Breed:</strong> {pet.breed}</p>
                      <p><strong>Age:</strong> {pet.age} years</p>
                      <p><strong>Gender:</strong> {pet.gender}</p>
                    </Col>
                    <Col md={6}>
                      <h6 className="text-primary">Health Info</h6>
                      <p><strong>Microchip:</strong> {pet.microchipNumber || "N/A"}</p>
                      <p><strong>Spayed/Neutered:</strong> {pet.spayedNeutered ? "Yes" : "No"}</p>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <h6 className="text-primary">Tag Info</h6>
                      <p><strong>Type:</strong> {pet.tagType || "N/A"}</p>
                    </Col>
                    <Col md={6}>
                      <h6 className="text-primary">Vet & Insurance</h6>
                      <p><strong>Vet:</strong> {pet.vetInfo || "N/A"}</p>
                      <p><strong>Insurance:</strong> {pet.insuranceInfo || "N/A"}</p>
                    </Col>
                  </Row>

                  <div className="mt-3">
                    <Button
                      variant="outline-success"
                      onClick={() => handleShowQRModal(pet)}
                    >
                      <FaQrcode className="me-2" />
                      View PDF
                    </Button>

                    <QRCodeCanvas
                      id={`qr-${pet._id}`}
                      value={`https://foundyourpet.vercel.app/pet-profile/${pet._id}`}
                      size={200}
                      level="H"
                      includeMargin={true}
                      className="d-none"
                    />
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

  
      {/* QR Modal */}
      <Modal
        show={showQRModal}
        onHide={() => setShowQRModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>QR Code Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedPet && (
            <>
              <QRCodeCanvas
                value={`https://foundyourpet.vercel.app/pet-profile/${selectedPet._id}`}
                size={200}
                level="H"
                includeMargin={true}
              />
              <div className="mt-4 d-flex flex-column gap-2">
                <Button
                  variant="outline-success"
                  onClick={() => handleDownloadQRCode(selectedPet._id)}
                >
                  <FaQrcode className="me-2" />
                  Download QR Code (PNG)
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => handleDownloadQRCodeAsPDF(selectedPet._id)}
                >
                  <FaFilePdf className="me-2" />
                  Download QR as PDF
                </Button>
                <Button
                  variant="outline-dark"
                  onClick={() =>
                    handleDownloadQRCodeAsDXF(
                      selectedPet._id,
                      `https://foundyourpet.vercel.app/pet-profile/${selectedPet._id}`
                    )
                  }
                >
                  <FaDownload className="me-2" />
                  Download QR as DXF
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
  
  
}

export default AdminDashboard;
