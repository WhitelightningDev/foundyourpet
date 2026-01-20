import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";

export default function PublicPetProfile() {
  const { petId } = useParams();
  const [petData, setPetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Location access denied or unavailable:", error.message);
          setLocation(null);
        }
      );
    }
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/pets/public/${petId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch pet info");
        }
        return res.json();
      })
      .then((data) => {
        setPetData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load pet details. Please try again later.");
        setLoading(false);
      });
  }, [petId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="fs-5 fw-semibold text-secondary">Loading pet profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  function formatPhoneNumberForWhatsApp(number) {
    if (!number) return "";
    const digits = number.replace(/\D/g, "");
    if (digits.length === 10 && digits.startsWith("0")) {
      return "27" + digits.slice(1);
    }
    if (digits.length >= 11 && digits.startsWith("27")) {
      return digits;
    }
    return digits;
  }

  const { pet, owner } = petData;
  const formattedNumber = formatPhoneNumberForWhatsApp(owner?.contact);

  const baseMessage = `Hi, I have found your pet ${pet.name}. Please contact me so we can arrange to get your pet back to you.`;
  const locationMessage = location
    ? `\n\nHere is my location: https://www.google.com/maps?q=${location.latitude},${location.longitude}`
    : "";

  const whatsappLink = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(
    baseMessage + locationMessage
  )}`;

  return (
    <div className="container py-5 bg-light d-flex justify-content-center">
      <div className="card shadow-lg w-100" style={{ maxWidth: "600px", borderRadius: "1rem" }}>
        <div className="card-header bg-primary text-white text-center fs-4 fw-bold">
          <i className="bi bi-person-circle me-2"></i>{pet.name}'s Profile
        </div>
        <div className="card-body text-center">
          {pet.photoUrl && (
            <img
              src={pet.photoUrl}
              alt={pet.name}
              className="rounded-circle img-thumbnail mb-4"
              style={{ width: "140px", height: "140px", objectFit: "cover" }}
            />
          )}

          <ul className="list-group list-group-flush mb-4 text-start">
            <li className="list-group-item"><strong>Breed:</strong> {pet.breed}</li>
            <li className="list-group-item"><strong>Color:</strong> {pet.color || "N/A"}</li>
            <li className="list-group-item"><strong>Gender:</strong> {pet.gender}</li>
            <li className="list-group-item"><strong>Species:</strong> {pet.species}</li>
            <li className="list-group-item"><strong>Age:</strong> {pet.age} years</li>
            <li className="list-group-item"><strong>Microchip:</strong> {pet.microchipNumber || "N/A"}</li>
          </ul>

          <div className="mt-4 text-start">
            <h5 className="fw-bold text-dark">
              <i className="bi bi-person-lines-fill me-2 text-primary"></i>Owner Contact
            </h5>
            <p className="mb-2">
              <i className="bi bi-envelope-fill me-2 text-secondary"></i>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${owner?.email}`} className="text-decoration-none text-primary">
                {owner?.email || "Not available"}
              </a>
            </p>
            <p className="mb-0">
              <i className="bi bi-telephone-fill me-2 text-secondary"></i>
              <strong>Phone:</strong>{" "}
              <a href={`tel:${owner?.contact}`} className="text-decoration-none text-primary me-2">
                {owner?.contact || "Not available"}
              </a>
              {owner?.contact && (
                <a
                  href={whatsappLink}
                  className="btn btn-outline-success btn-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-whatsapp me-1"></i>WhatsApp
                </a>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
