import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const SuccessPage = () => {
  const [params] = useSearchParams();
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");
  const [membershipUpdated, setMembershipUpdated] = useState(false);
  const [updatingMemberships, setUpdatingMemberships] = useState(false);

  const paymentId = params.get("paymentId");

  // Fetch payment details
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
        console.error(err);
        setError("Error fetching payment details.");
      }
    };
    if (paymentId) fetchDetails();
  }, [paymentId]);


  // Update pet memberships
  useEffect(() => {
    const updateMemberships = async () => {
      if (details && details.pets && details.membership && !membershipUpdated) {
        setUpdatingMemberships(true);
        try {
          const results = await Promise.all(
            details.pets.map(async (pet) => {
              const res = await axios.post("http://localhost:5001/api/pets/updateMembership", {
                petId: pet._id,
                membership: details.membership._id,
              });
              return res.data;
            })
          );

          console.log("Membership update results:", results);
          setMembershipUpdated(true);
        } catch (err) {
          console.error("Failed to update pet memberships:", err);
          setError("Failed to update pet memberships.");
        } finally {
          setUpdatingMemberships(false);
        }
      }
    };

    updateMemberships();
  }, [details, membershipUpdated]);

  if (error) {
    return (
      <div className="container">
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="container">
        <p>Loading payment details...</p>
      </div>
    );
  }

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

      {updatingMemberships && (
        <div className="alert alert-info mt-4">
          Updating pet membership status...
        </div>
      )}

      {membershipUpdated && (
        <div className="alert alert-success mt-4">
          ✅ Pet membership successfully updated in the system!
        </div>
      )}
    </div>
  );
};

export default SuccessPage;
