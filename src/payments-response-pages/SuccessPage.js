import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const SuccessPage = () => {
  const [params] = useSearchParams();
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [, setMembershipUpdated] = useState(false);

  const paymentId = params.get("paymentId");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        // Fetch payment details
        const { data } = await axios.get(`http://localhost:5001/api/payment/details/${paymentId}`);

        if (data.success) {
          setDetails(data.data);

          // Now activate membership for the user
          const userId = data.data.user._id;
          const activateRes = await axios.post('http://localhost:5001/api/users/activate-membership', { userId });

          if (activateRes.status === 200) {
            setMembershipUpdated(true);

            // Optional: Re-fetch payment details to get updated membership status
            const refreshedData = await axios.get(`http://localhost:5001/api/payment/details/${paymentId}`);
            if (refreshedData.data.success) {
              setDetails(refreshedData.data.data);
            }
          } else {
            setError("Failed to activate membership.");
          }
        } else {
          setError("Could not retrieve payment details.");
        }
      } catch (err) {
        setError("Error fetching payment details or activating membership.");
      } finally {
        setLoading(false);
      }
    };

    if (paymentId) fetchDetails();
  }, [paymentId, setMembershipUpdated]);

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (error) return <div className="container"><h1>Error</h1><p>{error}</p></div>;

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
