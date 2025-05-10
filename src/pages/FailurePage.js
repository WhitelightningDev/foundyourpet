import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const FailurePage = () => {
  const { state } = useLocation();

  useEffect(() => {
    // You can display error details or retry logic if needed.
    console.log("Payment Failed", state);
  }, [state]);

  return (
    <div className="container">
      <h1>Payment Failed!</h1>
      <p>Unfortunately, your payment could not be processed. Please try again.</p>
      <p>If the issue persists, please contact us for assistance.</p>
    </div>
  );
};

export default FailurePage;
