import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const role = localStorage.getItem("role"); // Get user role from localStorage
  const location = useLocation();

  if (!role) {
    // Redirect to login if no role found
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
