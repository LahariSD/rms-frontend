import { UploadFile } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AddFaculty from "../../components/AddFaculty";
import { ADMIN_API_ENDPOINTS, API_BASE_URL } from "../../data/Constants";

const FacultyDetails = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedFile, setSelectedFile] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}${ADMIN_API_ENDPOINTS.GET_ALL_FACULTY_DETAILS}`)
      .then((response) => {
        setFaculties(response.data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching faculties:", error));
  }, []);

  const toggleSort = (field) => {
    setSortField(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedFaculties = [...faculties].sort((a, b) => {
    if (sortField === "name" || sortField === "department") {
      return sortOrder === "asc"
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    }
    return 0;
  });

  const handleOpen = (subject = null) => {
    setOpen(!open);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex gap-3 items-center">
        <Button
          variant="contained"
          color={open ? "error" : "primary"}
          onClick={() => handleOpen()}
        >
          {open ? "Cancel" : "Add Faculty"}
        </Button>

        {/* Upload Excel Button */}
        <Button variant="contained" color="secondary" component="label">
          <UploadFile />
          Upload Excel
          <input
            type="file"
            name="file"
            hidden
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
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

      {loading ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <>
          {open ? (
            <AddFaculty />
          ) : (
            <div>
              <Typography
                variant="h4"
                className="text-center mb-4 text-blue-700"
              >
                Faculty Details
              </Typography>
              <TableContainer component={Paper} className="shadow-lg">
                <Table>
                  <TableHead>
                    <TableRow className="bg-gray-200">
                      <TableCell
                        className="font-bold cursor-pointer"
                        onClick={() => toggleSort("name")}
                      >
                        Name{" "}
                        {sortField === "name"
                          ? sortOrder === "asc"
                            ? "⬆️"
                            : "⬇️"
                          : ""}
                      </TableCell>
                      <TableCell className="font-bold">Email</TableCell>
                      <TableCell className="font-bold"> Designation</TableCell>
                      <TableCell
                        className="font-bold cursor-pointer"
                        onClick={() => toggleSort("department")}
                      >
                        Department{" "}
                        {sortField === "department"
                          ? sortOrder === "asc"
                            ? "⬆️"
                            : "⬇️"
                          : ""}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedFaculties.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4">
                          No faculties found
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedFaculties.map((faculty) => (
                        <TableRow
                          key={faculty._id}
                          className="hover:bg-gray-100"
                        >
                          <TableCell>{faculty.name}</TableCell>
                          <TableCell>{faculty.email}</TableCell>
                          <TableCell>{faculty.designation}</TableCell>
                          <TableCell>{faculty.department}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FacultyDetails;
