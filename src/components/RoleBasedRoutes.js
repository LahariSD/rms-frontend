import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import routesConfig from "../routes/routesConfig";

const RoleBasedRoutes = ({ userRole }) => {
  const roleRoutes = routesConfig[userRole] || [];

  return (
    <Routes>
      {roleRoutes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
      {/* Redirect unknown paths to dashboard */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default RoleBasedRoutes;
