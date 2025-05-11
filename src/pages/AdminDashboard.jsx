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
      <h3 className="mb-4 fw-bold border-bottom">Admin Dashboard</h3>
      <h5 className="badge text-bg-primary rounded-pill mb-4">
        Total users: <strong>{users.length}</strong>
      </h5>

      <Row className="mb-5">
  <Col sm={12}>
    <h4 className="mb-4 text-primary text-center border-bottom pb-2 fw-bold">
      Admin Users
    </h4>
    <Row>
      {adminUsers.map((user) => (
        <Col md={4} sm={6} xs={12} key={user._id} className="mb-4">
          <Card className="h-100 shadow-sm border-2 rounded-4">
            <Card.Body className="d-flex flex-column justify-content-between p-4">
              <div className="d-flex align-items-center mb-3">
                <div
                  className="bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ width: 48, height: 48 }}
                >
                  <span className="fw-bold text-primary fs-5">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h6 className="mb-1 fw-semibold">
                    {user.name} {user.surname}
                  </h6>
                  <small className="text-muted">{user.email}</small>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <Badge bg="success" pill className="px-3 py-1 text-uppercase">
                  Admin
                </Badge>
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
        </Col>
      ))}
    </Row>
  </Col>

  <Col sm={12} className="mt-5">
    <h4 className="mb-4 text-secondary text-center border-bottom pb-2 fw-bold">
      Regular Users
    </h4>
    <Row>
      {regularUsers.map((user) => (
        <Col md={4} sm={6} xs={12} key={user._id} className="mb-4">
          <Card className="h-100 shadow-xl border-2 rounded-4">
            <Card.Body className="d-flex flex-column justify-content-between p-4">
              <div>
                <h6 className="fw-semibold mb-1">
                  {user.name} {user.surname}
                </h6>
                <small className="text-muted">{user.email}</small>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <Badge bg="secondary" pill className="px-3 py-1 text-uppercase">
                  User
                </Badge>
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
        </Col>
      ))}
    </Row>
  </Col>
</Row>


      {/* User Details Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>User Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Row>
              <Col md={12}>
                <Card className="mb-4 text-center border-2 mt-4 shadow-sm">
                  <Card.Body>
                    <h3 className="text-primary fw-bold">
                      {selectedUser.name} {selectedUser.surname}
                    </h3>
                    <p>
                      <strong>Email:</strong> {selectedUser.email}
                    </p>
                    <p>
                      <strong>Contact:</strong> {selectedUser.contact}
                    </p>
                    <p>
                      <strong>Address:</strong> {selectedUser.address?.street},{" "}
                      {selectedUser.address?.city}
                    </p>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={12}>
                <h4 className="text-primary border-bottom pb-3 mb-4 text-center fw-bold">
                  Registered Pets
                </h4>

                {pets.length === 0 ? (
                  <div className="text-center text-muted fs-5">
                    No pets found.
                  </div>
                ) : (
                  <Row>
                    {pets.map((pet) => (
                      <Col md={6} key={pet._id}>
                        <Card className="mb-4 shadow-sm border-2 rounded-4">
                          <Card.Header className="bg-secondary border-bottom-0 rounded-top-4 py-3 px-4 d-flex align-items-center">
                            <div className="me-3">
                              {pet.photoUrl ? (
                                <img
                                  src={
                                    pet.photoUrl.startsWith("http")
                                      ? pet.photoUrl
                                      : `https://foundyourpet-backend.onrender.com${pet.photoUrl}`
                                  }
                                  alt={`${pet.name}'s profile`}
                                  style={{
                                    width: "70px",
                                    height: "70px",
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                    border: "2px solid #dee2e6",
                                  }}
                                />
                              ) : (
                                <div
                                  className="text-muted text-center"
                                  style={{ width: 70 }}
                                >
                                  No Image
                                </div>
                              )}
                            </div>
                            <div>
                              <h5 className="mb-1 text-warning fw-bold">
                                {pet.name}
                              </h5>
                              <p className="mb-0 text-black small">
                                {pet.species} • {pet.breed}
                              </p>
                            </div>
                          </Card.Header>

                          <Card.Body className="px-4 pt-3">
                            <Row className="mb-3">
                              <Col md={6}>
                                <h6 className="text-secondary fw-bold">
                                  Basic Info
                                </h6>
                                <p>
                                  <strong>Age:</strong> {pet.age} years
                                </p>
                                <p>
                                  <strong>Gender:</strong> {pet.gender}
                                </p>
                      
                                <p>
                                  <strong>Spayed/Neutered:</strong>{" "}
                                  {pet.spayedNeutered ? "Yes" : "No"}
                                </p>
                              </Col>
                              <Col md={6}>
                                <h6 className="text-secondary fw-bold">
                                  Medical & Tag
                                </h6>
                                <p>
                                  <strong>Tag Type:</strong>{" "}
                                  {pet.tagType || "N/A"}
                                </p>
                               
                              </Col>
                            </Row>

                            <hr />

                            <Row className="mb-3">
                              <Col>
                                <h6 className="text-secondary fw-bold">
                                  Membership
                                </h6>
                                <p>
                                  <strong>Status:</strong>{" "}
                                  <Badge
                                    bg={
                                      pet.hasMembership
                                        ? "success"
                                        : "secondary"
                                    }
                                  >
                                    {pet.hasMembership ? "Active" : "Inactive"}
                                  </Badge>
                                </p>
                                {pet.hasMembership && (
                                  <>
                                    <p>
                                      <strong>Type:</strong>{" "}
                                      {pet.membership || "N/A"}
                                    </p>
                                    <p>
                                      <strong>Start Date:</strong>{" "}
                                      {new Date(
                                        pet.membershipStartDate
                                      ).toLocaleDateString()}
                                    </p>
                                  </>
                                )}
                              </Col>
                            </Row>

                            <div className="text-end">
                              <Button
                                variant="outline-success"
                                onClick={() => handleShowQRModal(pet)}
                              >
                                <FaQrcode className="me-2" />
                                View PDF
                              </Button>

                              <QRCodeCanvas
                                id={`qr-${pet._id}`}
                                value={`https://foundyourpet.vercel.app/p/${pet._id}`}
                                size={128}
                                level="L"
                                includeMargin
                                className="d-none"
                              />
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
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

      {/* QR Code Modal */}
      <Modal show={showQRModal} onHide={() => setShowQRModal(false)} centered>
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
                includeMargin
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
