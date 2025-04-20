import { Delete, Edit } from "@mui/icons-material";
import {
  Button,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ADMIN_API_ENDPOINTS, API_BASE_URL } from "../../data/Constants";

const DepartmentsDetails = () => {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: "", code: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [displayCreateForm, setDisplayCreateForm] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${ADMIN_API_ENDPOINTS.GET_DEPARTMENT_DETAILS}`
      );
      // sort the departments by name
      const sortedDepartments = response.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setDepartments(sortedDepartments);
    } catch (error) {
      showSnackbar("Error fetching departments", "error");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(
          `${API_BASE_URL}${ADMIN_API_ENDPOINTS.UPDATE_DEPARTMENT_DETAILS}?id=${editId}`,
          form
        );
      } else {
        await axios.post(
          `${API_BASE_URL}${ADMIN_API_ENDPOINTS.CREATE_DEPARTMENT}`,
          form
        );
      }
      setForm({ name: "", code: "", description: "" });
      setEditId(null);
      fetchDepartments();
      showSnackbar(
        `Department ${editId ? "updated" : "created"} successfully`,
        "success"
      );
    } catch (error) {
      showSnackbar("Error saving department", "error");
    }
  };

  const handleEdit = (department) => {
    setDisplayCreateForm(true);
    setForm(department);
    setEditId(department._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/admin/deleteDepartment?id=${id}`);
      fetchDepartments();
      showSnackbar("Department deleted successfully", "success");
    } catch (error) {
      showSnackbar("Error deleting department", "error");
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-700">
        Department Management
      </h1>

      {/* Have a button on right side of the page */}
      <div className="flex justify-end mb-4" hidden={!displayCreateForm}>
        <Button
          variant="contained"
          color={displayCreateForm ? "error" : "primary"}
          type="submit"
          onClick={() => {
            setDisplayCreateForm(!displayCreateForm);
          }}
        >
          {displayCreateForm ? "Cancel" : "Create Department"}
        </Button>
      </div>

      <div hidden={!displayCreateForm}>
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 mb-6 bg-white p-4 shadow-md rounded-lg"
        >
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Code"
            name="code"
            value={form.code}
            onChange={handleChange}
            required
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
          <Button variant="contained" color="primary" type="submit">
            {editId ? "Update Department" : "Create Department"}
          </Button>
        </form>
      </div>

      {/* Table */}
      <TableContainer component={Paper} className="shadow-lg">
        <Table>
          <TableHead>
            <TableRow className="bg-blue-100">
              <TableCell className="font-bold">Name</TableCell>
              <TableCell className="font-bold">Code</TableCell>
              <TableCell className="font-bold">Description</TableCell>
              <TableCell className="font-bold text-center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.map((dept) => (
              <TableRow key={dept.id} className="hover:bg-gray-50">
                <TableCell>{dept.name}</TableCell>
                <TableCell>{dept.code}</TableCell>
                <TableCell>{dept.description}</TableCell>
                <TableCell className="flex gap-2 justify-center">
                  <IconButton color="primary" onClick={() => handleEdit(dept)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(dept.id)}
                    disabled
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <MuiAlert elevation={6} variant="filled" severity={snackbar.severity}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default DepartmentsDetails;
