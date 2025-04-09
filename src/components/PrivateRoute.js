import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, loading } = useContext(AuthContext);

  // Display loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or another component
  }

  // If logged in, show children, else redirect to login
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
