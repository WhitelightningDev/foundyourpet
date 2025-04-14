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
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p className="fs-5 fw-semibold">Loading pet profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p className="text-danger fs-5">{error}</p>
      </div>
    );
  }

  const { pet, owner } = petData;

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-lg" style={{ maxWidth: '600px', borderRadius: '20px' }}>
        <div className="card-body text-center p-4">
          <h2 className="card-title mb-4 fw-bold">{pet.name}'s Profile</h2>

          {pet.photoUrl && (
            <img
              src={pet.photoUrl}
              alt={`${pet.name}`}
              className="rounded-circle img-thumbnail mb-4"
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
          )}

          <ul className="list-group list-group-flush text-start mb-4">
            <li className="list-group-item"><strong>Breed:</strong> {pet.breed}</li>
            <li className="list-group-item"><strong>Color:</strong> {pet.color || 'N/A'}</li>
            <li className="list-group-item"><strong>Species:</strong> {pet.species}</li>
            <li className="list-group-item"><strong>Age:</strong> {pet.age} years</li>
            <li className="list-group-item"><strong>Gender:</strong> {pet.gender}</li>
            <li className="list-group-item"><strong>Microchip:</strong> {pet.microchipNumber || 'N/A'}</li>
          </ul>

          <div className="border-top pt-3">
            <h5 className="fw-semibold mb-3">Owner Contact</h5>
            <p className="mb-1"><strong>Email:</strong> <a href={`mailto:${owner?.email}`}>{owner?.email || 'Not available'}</a></p>
            <p><strong>Phone:</strong> <a href={`tel:${owner?.contact}`}>{owner?.contact || 'Not available'}</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
