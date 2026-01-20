import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children, requireAdmin = false }) => {
  const { isLoggedIn, loading, user } = useContext(AuthContext);

  // Display loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or another component
  }

  // If logged in, show children, else redirect to login
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (requireAdmin && !user?.isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

export default PrivateRoute;
