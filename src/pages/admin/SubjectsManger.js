import { Edit, UploadFile } from "@mui/icons-material"; // Added UploadFile icon
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import { useEffect, useState } from "react";
import { ADMIN_API_ENDPOINTS, API_BASE_URL } from "../../data/Constants";

export default function SubjectsManager() {
  const [subjects, setSubjects] = useState([]);
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    credits: "",
    department: "",
    academicRegulation: "",
  });
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // State for selected file

  useEffect(() => {
    fetchDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${ADMIN_API_ENDPOINTS.GET_DEPARTMENT_DETAILS}`
      );
      const sortedDepartments = response.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setDepartments(sortedDepartments);
    } catch (error) {
      showSnackbar("Error fetching departments", "error");
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchSubjects = async () => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}${ADMIN_API_ENDPOINTS.GET_ALL_SUBJECTS}`
      );
      const sortedSubjects = data.sort((a, b) => a.code.localeCompare(b.code));
      setSubjects(sortedSubjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpen = (subject = null) => {
    if (subject) {
      setFormData(subject);
      setEditingId(subject._id);
    } else {
      setFormData({
        code: "",
        name: "",
        credits: "",
        department: "",
        academicRegulation: "",
      });
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setDepartment("");
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `${API_BASE_URL}${ADMIN_API_ENDPOINTS.UPDATE_SUBJECT}/${editingId}`,
          formData
        );
      } else {
        await axios.post(
          `${API_BASE_URL}${ADMIN_API_ENDPOINTS.CREATE_SUBJECT}`,
          formData
        );
      }
      fetchSubjects();
      handleClose();
    } catch (error) {
      console.error("Error saving subject:", error);
    }
  };

  const handleDepartment = (e) => {
    setDepartment(e.target.value);
    const selectedDept = departments.find(
      (dept) => dept.name === e.target.value
    );

    setFormData((prevFormData) => ({
      ...prevFormData,
      department: e.target.value,
      departmentCode: selectedDept.code,
    }));
  };

  // 🔹 Handle File Selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // 🔹 Upload Excel File
  const handleUpload = async () => {
    if (!selectedFile) {
      showSnackbar("Please select a file!", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post(
        `${API_BASE_URL}${ADMIN_API_ENDPOINTS.CREATE_SUBJECTS}`, // Your API endpoint
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      showSnackbar("File uploaded successfully!", "success");
      fetchSubjects();
    } catch (error) {
      console.error("Upload error:", error);
      showSnackbar("Failed to upload file", "error");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📚 Subjects Management</h2>
      <div className="mb-4 flex gap-3 items-center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpen()}
        >
          ➕ Add Subject
        </Button>

        {/* Upload Excel Button */}
        <Button variant="contained" color="secondary" component="label">
          <UploadFile />
          Upload Excel
          <input type="file" name="file" hidden onChange={handleFileChange} />
        </Button>

        {/* Display selected file name */}
        {selectedFile && (
          <Typography variant="body1" className="text-gray-700">
            📄 {selectedFile.name}
          </Typography>
        )}

        {selectedFile && (
          <Button variant="contained" color="success" onClick={handleUpload}>
            📤 Upload
          </Button>
        )}
      </div>

      {/* Table for displaying subjects */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell>
                <strong>Code</strong>
              </TableCell>
              <TableCell>
                <strong>Subject Name</strong>
              </TableCell>
              <TableCell>
                <strong>Credits</strong>
              </TableCell>
              <TableCell>
                <strong>Department</strong>
              </TableCell>
              <TableCell>
                <strong>Regulation</strong>
              </TableCell>
              <TableCell>
                <strong>Semester</strong>
              </TableCell>
              <TableCell>
                <strong>Edit</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.map((subject) => (
              <TableRow key={subject._id}>
                <TableCell>{subject.code}</TableCell>
                <TableCell>{subject.name}</TableCell>
                <TableCell>{subject.credits}</TableCell>
                <TableCell>{subject.department || "N/A"}</TableCell>
                <TableCell>{subject.academicRegulation}</TableCell>
                <TableCell>{subject.semester}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleOpen(subject)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Adding/Editing */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingId ? "Edit Subject" : "Add Subject"}</DialogTitle>
        <DialogContent className="space-y-3">
          <TextField
            name="code"
            label="Code"
            value={formData.code}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            name="credits"
            label="Credits"
            type="number"
            value={formData.credits}
            onChange={handleChange}
            fullWidth
            required
          />
          <FormControl fullWidth>
            <InputLabel>Department</InputLabel>
            <Select
              value={department}
              onChange={(e) => handleDepartment(e)}
              label="Department"
              //   displayEmpty
            >
              <MenuItem value="">Select Department</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept._id} value={dept.name}>
                  {dept.name} ({dept.code})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            name="academicRegulation"
            label="Regulation"
            value={formData.academicRegulation}
            onChange={handleChange}
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editingId ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
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
}
