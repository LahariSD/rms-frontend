import { AccountCircle, ExitToApp } from "@mui/icons-material"; // Import MUI icons
import React from "react";
import { Link } from "react-router-dom";
import Banner from "../assets/banner.jpg";
import routesConfig from "../routes/routesConfig";

const Navbar = () => {
  const userRole = localStorage.getItem("role") || "guest"; // Default to guest
  const userName = localStorage.getItem("name") || "User"; // Get registered user name

  return (
    <div>
      <img
        src={Banner}
        alt="College Banner"
        style={{ width: "100%", height: "auto" }}
      />
      <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
        <ul className="flex space-x-4">
          {/* Dynamically render role-based links with custom names */}
          {routesConfig[userRole]?.map(
            ({ path, name }) =>
              name !== "Profile" && (
                <li key={path}>
                  <Link to={path}>{name || "Unnamed Route"}</Link>
                </li>
              )
          )}
        </ul>

        {/* Profile & Logout Section */}
        <div className="flex items-center space-x-4">
          <Link to="/profile" className="flex items-center space-x-1">
            <AccountCircle fontSize="medium" /> {/* Profile Icon */}
            <span>{userName}</span>
          </Link>
          <Link
            to="/login"
            className="flex items-center space-x-1 text-red-400"
            onClick={() => localStorage.clear()}
          >
            <ExitToApp fontSize="medium" /> {/* Logout Icon */}
            <span>Logout</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
