import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function PublicPetProfile() {
  const { petId } = useParams();
  const [petData, setPetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://foundyourpet-backend.onrender.com/api/pets/public/${petId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch pet info');
        }
        return res.json();
      })
      .then(data => {
        setPetData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Could not load pet details. Please try again later.');
        setLoading(false);
      });
  }, [petId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <p className="fs-5 fw-semibold text-secondary">Loading pet profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <p className="text-danger fs-5">{error}</p>
      </div>
    );
  }

  const { pet, owner } = petData;

  const whatsappMessage = `Hi, I have found your pet ${pet.name}. Please contact me so we can arrange to get your pet back to you.`;
  const whatsappLink = `https://wa.me/${owner?.contact?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="container py-5 d-flex justify-content-center bg-light">
      <div className="card shadow-lg" style={{ maxWidth: '550px', borderRadius: '1rem' }}>
        <div className="card-body text-center p-4">
          <h2 className="card-title mb-3 fw-bold text-primary">
            <i className="bi bi-person-circle me-2"></i>{pet.name}'s Profile
          </h2>

          {pet.photoUrl && (
            <img
              src={pet.photoUrl}
              alt={pet.name}
              className="rounded-circle img-thumbnail mb-4"
              style={{ width: '140px', height: '140px', objectFit: 'cover' }}
            />
          )}

          <ul className="list-group list-group-flush text-start mb-4">
            <li className="list-group-item">
              <i className="bi bi-tags-fill me-2 text-secondary"></i><strong>Breed:</strong> {pet.breed}
            </li>
            <li className="list-group-item">
              <i className="bi bi-palette-fill me-2 text-secondary"></i><strong>Color:</strong> {pet.color || 'N/A'}
            </li>
            <li className="list-group-item">
              <i className="bi bi-gender-ambiguous me-2 text-secondary"></i><strong>Gender:</strong> {pet.gender}
            </li>
            <li className="list-group-item">
              <i className="bi bi-paw-fill me-2 text-secondary"></i><strong>Species:</strong> {pet.species}
            </li>
            <li className="list-group-item">
              <i className="bi bi-hourglass-split me-2 text-secondary"></i><strong>Age:</strong> {pet.age} years
            </li>
            <li className="list-group-item">
              <i className="bi bi-cpu me-2 text-secondary"></i><strong>Microchip:</strong> {pet.microchipNumber || 'N/A'}
            </li>
          </ul>

          <div className="border-top pt-3 text-start">
            <h5 className="fw-bold text-dark mb-3">
              <i className="bi bi-person-lines-fill me-2 text-primary"></i>Owner Contact
            </h5>
            <p className="mb-2">
              <i className="bi bi-envelope-fill me-2 text-secondary"></i>
              <strong>Email:</strong>{' '}
              <a href={`mailto:${owner?.email}`} className="text-decoration-none text-primary">
                {owner?.email || 'Not available'}
              </a>
            </p>
            <p>
              <i className="bi bi-telephone-fill me-2 text-secondary"></i>
              <strong>Phone:</strong>{' '}
              <a href={`tel:${owner?.contact}`} className="text-decoration-none text-primary me-3">
                {owner?.contact || 'Not available'}
              </a>
              {owner?.contact && (
                <a href={whatsappLink} className="text-success" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-whatsapp fs-5"></i>
                </a>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
