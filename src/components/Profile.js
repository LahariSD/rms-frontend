import { Avatar } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user details from local storage
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      navigate("/login"); // Redirect to login if no user found
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  if (!user) return null; // Prevent rendering if user is null

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-4">
        {/* Profile Avatar */}
        <Avatar sx={{ bgcolor: deepPurple[500], width: 80, height: 80 }}>
          {user.name?.charAt(0).toUpperCase()}
        </Avatar>

        <div>
          <h1 className="text-2xl font-semibold">{user.name}</h1>
          <p className="text-gray-500 capitalize">{user.role}</p>
        </div>
      </div>

      {/* Profile Information */}
      <div className="mt-5 space-y-2">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        {user.role === "faculty" && (
          <p>
            <strong>Department:</strong> {user.department}
          </p>
        )}
        {user.role === "student" && (
          <>
            <p>
              <strong>Batch:</strong> {user.batch}
            </p>
            <p>
              <strong>Semester:</strong> {user.semester}
            </p>
          </>
        )}
      </div>

      {/* Logout Button */}
      <button
        className="mt-5 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        onClick={() => {
          localStorage.removeItem("user");
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
