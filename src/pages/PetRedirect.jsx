import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function PetRedirect() {
  const { petId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (petId) {
      navigate(`/pet-profile/${petId}`, { replace: true });
    }
  }, [petId, navigate]);

  return null;
}
