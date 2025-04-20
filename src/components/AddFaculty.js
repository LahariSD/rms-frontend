import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { ADMIN_API_ENDPOINTS, API_BASE_URL } from "../data/Constants";
import DepartmentsJson from "../data/Departments.json";

const AddFaculty = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
    password: "",
    confirmpassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    const officialMail = "@becbapatla.ac.in";
    e.preventDefault();
    if (formData.password !== formData.confirmpassword) {
      return alert("Passwords do not match");
    }
    if (!formData.email.includes(officialMail)) {
      return alert("Faculty Email should be official mail");
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}${ADMIN_API_ENDPOINTS.CREATE_FACULTY_PROFILE}`,
        {
          name: formData.name,
          email: formData.email,
          department: formData.department,
          designation: formData.designation,
          password: formData.password,
        }
      );
      alert(
        `${response.data.faculty.name} Faculty Profile Created Successfully`
      );
    } catch (error) {
      console.error(error);
      // display error in alert
      alert(` ${error.response.data.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Create New Faculty Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <TextField
          fullWidth
          label="Name"
          name="name"
          onChange={handleChange}
          className="my-4"
          required
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          onChange={handleChange}
          className="my-4"
          placeholder="@becbapatla.ac.in"
          required
        />

        <FormControl fullWidth className="my-4">
          <InputLabel>Department</InputLabel>
          <Select
            name="department"
            label="Department"
            value={formData.department}
            onChange={handleChange}
          >
            <MenuItem value="">All</MenuItem>
            {DepartmentsJson.map((dept) => (
              <MenuItem key={dept.value} value={dept.label}>
                {dept.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Designation"
          name="designation"
          type="name"
          onChange={handleChange}
          className="my-4"
          required
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          onChange={handleChange}
          className="my-4"
          required
        />
        <TextField
          fullWidth
          label="Confirm-Password"
          name="confirmpassword"
          type="password"
          onChange={handleChange}
          className="my-4"
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className="mt-4"
        >
          Register New Faculty
        </Button>
      </form>
    </div>
  );
};

export default AddFaculty;
