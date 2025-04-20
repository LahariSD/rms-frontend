import {
  Button,
  Card,
  CardContent,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL, AUTH_API_ENDPOINTS, ROLES } from "../../data/Constants";

const Login = () => {
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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg rounded-lg">
        <CardContent>
          <Typography variant="h5" className="text-center mb-4 font-bold">
            Login
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

            <Typography variant="body2" className="text-center text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-800"
              >
                Register
              </Link>
            </Typography>

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
