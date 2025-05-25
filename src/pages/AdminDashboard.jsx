import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import UserDetailsModal from "../components/UserDetailsModal";
import UserCard from "../components/UserCard";
import QRCodeModal from "../components/QRCodeModal";
import UserListSection from "../components/UserListSection";
function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
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
      setShowUserModal(true);
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("Failed to fetch user details");
    }
  };

  const handleShowQRModal = (pet) => {
    setSelectedPet(pet);
    setShowQRModal(true);
  };

  const handleDownloadQRCode = (id) => {
    const canvas = document.querySelector(`#qr-${id}`);
    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `${id}.png`;
    link.click();
  };

  const handleDownloadQRCodeAsPDF = (id) => {
    const canvas = document.querySelector(`#qr-${id}`);
    const imgData = canvas.toDataURL("image/png");
    const pdfWindow = window.open("", "_blank");
    pdfWindow.document.write(`<img src="${imgData}" />`);
    pdfWindow.document.close();
  };

  const handleDownloadQRCodeAsDXF = (id, url) => {
    alert(`DXF generation for ${id} pointing to ${url} is not implemented yet.`);
    // You may implement DXF generation via external APIs or libraries
  };

  const adminUsers = users.filter((user) => user.isAdmin);
  const regularUsers = users.filter((user) => !user.isAdmin);

  if (loading) return <div className="container mt-5">Loading users...</div>;
  if (error) return <div className="container mt-5 text-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <h3 className="mb-4 fw-bold border-bottom">Admin Dashboard</h3>
      <h5 className="badge text-bg-primary rounded-pill mb-4">
        Total users: <strong>{users.length}</strong>
      </h5>

      <Row className="mb-5">
        <Col sm={12}>
          <UserListSection
            title="Admin Users"
            users={adminUsers}
            badgeVariant="primary"
            badgeText="Admin"
            onView={handleViewDetails}
          />
        </Col>

        <Col sm={12} className="mt-5">
          <UserListSection
            title="Regular Users"
            users={regularUsers}
            badgeVariant="secondary"
            badgeText="User"
            onView={handleViewDetails}
          />
        </Col>
      </Row>

      <UserDetailsModal
        show={showUserModal}
        onHide={() => setShowUserModal(false)}
        user={selectedUser}
        pets={pets}
        handleShowQRModal={handleShowQRModal}
      />

      <QRCodeModal
        show={showQRModal}
        onHide={() => setShowQRModal(false)}
        pet={selectedPet}
        handleDownloadQRCode={handleDownloadQRCode}
        handleDownloadQRCodeAsPDF={handleDownloadQRCodeAsPDF}
        handleDownloadQRCodeAsDXF={handleDownloadQRCodeAsDXF}
      />
    </div>
  );
}

export default AdminDashboard;
