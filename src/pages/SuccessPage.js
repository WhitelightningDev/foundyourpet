import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SuccessPage = () => {
  const { state } = useLocation();

  useEffect(() => {
    // You can use state to display some information about the payment if needed.
    console.log("Payment Successful", state);
  }, [state]);

  return (
    <div className="container">
      <h1>Payment Successful!</h1>
      <p>Thank you for your purchase. Your payment was successful.</p>
      <p>If you have any questions, feel free to contact us.</p>
    </div>
  );
};

export default SuccessPage;
