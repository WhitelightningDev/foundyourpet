import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

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
        const token = localStorage.getItem("authToken");
        // Fetch payment details
        const { data } = await axios.get(
          `${API_BASE_URL}/api/payment/details/${paymentId}`,
          token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
        );

        if (data.success) {
          setDetails(data.data);

          // Optional: sync user membership flag (server only allows if payment is a successful membership purchase)
          if (data.data.kind === "membership" && token) {
            try {
              const activateRes = await axios.post(
                `${API_BASE_URL}/api/users/activate-membership`,
                { paymentId },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (activateRes.status === 200) setMembershipUpdated(true);
            } catch (e) {
              // ignore: webhook is the source of truth; this is only a fallback sync
            }
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
