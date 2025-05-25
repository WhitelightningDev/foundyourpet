import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import axios from "axios";

const SuccessPage = () => {
  const [params] = useSearchParams();
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const paymentId = params.get("paymentId");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5001/api/payment/details/${paymentId}`);
        if (data.success) {
          setDetails(data.data);
        } else {
          setError("Could not retrieve payment details.");
        }
      } catch (err) {
        setError("Error fetching payment details.");
      }
    };

    if (paymentId) fetchDetails();
  }, [paymentId]);

  if (error) return <div className="container"><h1>Error</h1><p>{error}</p></div>;
  if (!details) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container my-5">
      <h1>🎉 Payment Successful!</h1>
   
      <p>Thank you, {details.user.name} {details.user.surname}, for your purchase.</p>

      <h4 className="mt-4">Membership Status</h4>
      <p>{details.membership.name}: <strong>{details.membership.active ? "Active ✅" : "Inactive ❌"}</strong></p>

      <h4 className="mt-4">Pets Enrolled</h4>
      <ul>
        {details.pets.map(pet => (
          <li key={pet._id}>
            <strong>{pet.name}</strong> – {pet.breed}, {pet.species}
          </li>
        ))}
      </ul>

      <h5 className="mt-4">Amount Paid: R{details.amountPaid}</h5>
      <p>Package: {details.packageType}</p>
    </div>
  );
};

export default SuccessPage;
