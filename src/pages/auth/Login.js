import { Button, MenuItem, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BECcampus from "../../assets/bec-campus.png";
import BECLogo from "../../assets/bec-logo.jpeg";
import { API_BASE_URL, AUTH_API_ENDPOINTS, ROLES } from "../../data/Constants";

const LoginPage = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}${AUTH_API_ENDPOINTS.LOGIN}`,
        {
          role: userRole.toLocaleLowerCase(),
          email,
          password,
        }
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", userRole.toLocaleLowerCase());
        localStorage.setItem("email", email);

        // Redirect based on role
        if (userRole.toLocaleLowerCase() === "admin") {
          navigate("/a/dashboard");
        } else if (userRole.toLocaleLowerCase() === "faculty") {
          navigate("/f/dashboard");
        } else if (userRole.toLocaleLowerCase() === "student") {
          navigate("/s/dashboard");
        }
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${BECcampus})` }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-4">
          <img src={BECLogo} alt="BEC Logo" className="h-16" />
        </div>
        <Typography variant="h5" className="text-center mb-4 font-bold">
          Bapatla Engineering College
        </Typography>
        <Typography variant="h6" className="text-center mb-6 text-gray-700">
          Login Portal
        </Typography>
        {error && (
          <Typography color="error" className="text-center">
            {error}
          </Typography>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <TextField
            select
            label="Select Role"
            fullWidth
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            required
          >
            {ROLES.map((role) => (
              <MenuItem key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
