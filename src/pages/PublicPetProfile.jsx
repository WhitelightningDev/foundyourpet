import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function PublicPetProfile() {
  const { petId } = useParams();
  const [petData, setPetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://foundyourpet.onrender.com/api/pets/public/${petId}`)
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
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium">Loading pet profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  const { pet, owner } = petData; // Correctly destructure the pet and owner objects

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-2xl mt-10">
      <h2 className="text-3xl font-bold text-center mb-6">{pet.name}'s Profile</h2>

      {pet.photoUrl && (
        <div className="flex justify-center mb-6">
          <img
            src={pet.photoUrl}
            alt={`${pet.name}`}
            className="w-48 h-48 object-cover rounded-full border-4 border-gray-200"
          />
        </div>
      )}

      <div className="space-y-3">
        <p><strong>Breed:</strong> {pet.breed}</p>
        <p><strong>Color:</strong> {pet.color}</p>
        <p><strong>Species:</strong> {pet.species}</p>
        <p><strong>Age:</strong> {pet.age} years</p>
        <p><strong>Microchip:</strong> {pet.microchipNumber || 'N/A'}</p>
      </div>

      <hr className="my-6" />

      <div>
        <h3 className="text-xl font-semibold mb-2">Contact Owner</h3>
        <p><strong>Name:</strong> {owner.name} {owner.surname}</p>
        <p><strong>Email:</strong> <a href={`mailto:${owner.email}`} className="text-blue-500 underline">{owner.email}</a></p>
        <p><strong>Phone:</strong> <a href={`tel:${owner.contact}`} className="text-blue-500 underline">{owner.contact}</a></p>
      </div>
    </div>
  );
}
