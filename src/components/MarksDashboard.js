import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { API_BASE_URL, FACULTY_API_ENDPOINTS } from "../data/Constants";
import DepartmentsJson from "../data/Departments.json";
import Loader from "./Loader";

const MarksDashboard = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [department, setDepartment] = useState("All");
  const [batch, setBatch] = useState("");
  const [percentageFilter, setPercentageFilter] = useState("");
  const [maxActiveBacklogs, setMaxActiveBacklogs] = useState(""); // New State
  const [enableResultsBtn, setEnableResultsBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleClick = () => {
    setLoading(true);
    let ApiEndPoint = `${API_BASE_URL}`;
    if (department === "All") {
      ApiEndPoint = `${API_BASE_URL}${FACULTY_API_ENDPOINTS.GET_ALL_STUDENT_RESULTS}?batch=${batch}`;
    } else {
      ApiEndPoint = `${API_BASE_URL}${FACULTY_API_ENDPOINTS.GET_STUDENT_RESULTS}?department=${department}&batch=${batch}`;
    }
    axios
      .get(`${ApiEndPoint}`)
      .then((response) => {
        setStudents(response.data);
        setFilteredStudents(response.data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching students:", error));
  };

  const startYear = 2010;
  const currentYear = new Date().getFullYear();
  const batches = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => ({
      value: startYear + i,
      label: startYear + i,
    })
  );

  useEffect(() => {
    setLoading(true);
    let filtered = students;

    if (batch) {
      setEnableResultsBtn(true);
    } else {
      setEnableResultsBtn(false);
    }

    // Apply Percentage Filter
    if (percentageFilter !== "") {
      const minPercentage = parseFloat(percentageFilter);
      filtered = filtered.filter(
        (student) => student.percentage >= minPercentage
      );

      filtered.sort((a, b) => b.percentage - a.percentage);
    }

    // Apply Max Active Backlogs Filter
    if (maxActiveBacklogs !== "") {
      const maxBacklogs = parseInt(maxActiveBacklogs);
      filtered = filtered.filter(
        (student) => student.allActiveBacklogs <= maxBacklogs
      );
    }

    setFilteredStudents(filtered);
    setLoading(false);
  }, [department, batch, students, percentageFilter, maxActiveBacklogs]);

  const allSemesters = [
    ...new Set(students.flatMap((s) => s.semesters.map((sem) => sem.semester))),
  ].sort((a, b) => a - b);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim() === "") {
        setFilteredStudents(students);
      } else {
        const filtered = students.filter((student) =>
          student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredStudents(filtered);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, students]);

  const handleDownloadExcel = () => {
    if (filteredStudents.length === 0) {
      alert("No data available to download.");
      return;
    }

    // Format data for Excel
    const dataForExcel = filteredStudents.map((student) => {
      let studentData = {
        "Roll No": student.rollNumber,
        Name: student.name,
        Department: department === "All" ? student.department : department,
        CGPA: student.cgpa,
        Percentage: `${student.percentage}%`,
      };

      // Add each semester's GPA
      allSemesters.forEach((sem) => {
        const semData = student.semesters.find((s) => s.semester === sem);
        studentData[`Sem ${sem} GPA`] = semData
          ? (Math.floor(semData.sgpa * 100) / 100).toFixed(2)
          : "-";
      });

      return studentData;
    });

    // Create a new workbook and add the worksheet
    const ws = XLSX.utils.json_to_sheet(dataForExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Student Results");

    // Download the Excel file
    XLSX.writeFile(wb, `Student_Results_${batch}_${department}.xlsx`);
  };

  return (
    <div className="p-6">
      <Typography
        variant="h4"
        className="text-center font-semibold text-blue-700 mb-4"
      >
        Student Results
      </Typography>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <FormControl className="w-1/5">
          <InputLabel>Batch</InputLabel>
          <Select
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            label="Batch"
          >
            <MenuItem value="">Select Batch</MenuItem>
            {batches.map((b) => (
              <MenuItem key={b.value} value={b.value}>
                {b.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className="w-1/5">
          <InputLabel>Department</InputLabel>
          <Select
            value={department || "All"}
            onChange={(e) => setDepartment(e.target.value)}
            label="Department"
          >
            <MenuItem key="All" value="All">
              All
            </MenuItem>
            {DepartmentsJson.map((dept) => (
              <MenuItem key={dept.value} value={dept.label}>
                {dept.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Percentage Filter */}
        <TextField
          className="w-1/5"
          label="Min Percentage"
          type="number"
          value={percentageFilter}
          onChange={(e) => setPercentageFilter(e.target.value)}
          disabled={!enableResultsBtn}
        />

        {/* Max Active Backlogs Filter */}
        <TextField
          className="w-1/5"
          label="Max Active Backlogs"
          type="number"
          value={maxActiveBacklogs}
          onChange={(e) => setMaxActiveBacklogs(e.target.value)}
          disabled={!enableResultsBtn}
        />

        {/* Fetch Results Button */}
        <Button
          variant="contained"
          color="primary"
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
          onClick={handleClick}
          disabled={!enableResultsBtn}
        >
          Get Results
        </Button>
      </div>

      {/* Student Table */}
      {loading ? (
        <Loader />
      ) : (
        <>
          <Box className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
            {/* Search Bar */}
            <Box className="relative w-full md:w-1/2 flex items-center">
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search for a student (regd no)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                  "& .MuiOutlinedInput-input": {
                    paddingLeft: "12px",
                  },
                }}
              />
            </Box>
            {filteredStudents.length > 0 && (
              <Button
                variant="contained"
                color="secondary"
                className="mb-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleDownloadExcel}
              >
                Download Excel
              </Button>
            )}
          </Box>

          {/* Students Count */}
          <Typography variant="h6" fontWeight="bold" color="textPrimary">
            {filteredStudents.length}
            {filteredStudents.length === 1 ? " Student" : " Students"} Found
          </Typography>

          <TableContainer component={Paper} className="shadow-lg">
            <Table>
              <TableHead>
                <TableRow className="bg-gray-200">
                  <TableCell className="font-bold">Roll No</TableCell>
                  <TableCell className="font-bold">Name</TableCell>
                  <TableCell className="font-bold">CGPA</TableCell>
                  <TableCell className="font-bold">Percentage</TableCell>
                  <TableCell className="font-bold">Active Backlogs</TableCell>

                  {allSemesters.map((sem) => (
                    <TableCell key={sem} className="font-bold text-center">
                      Sem {sem}(GPA)
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={allSemesters.length + 4}
                      className="text-center py-4"
                    >
                      No records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student, index) => (
                    <TableRow
                      key={student._id}
                      className={
                        index % 2 === 0
                          ? "bg-white hover:bg-gray-300"
                          : "bg-gray-100 hover:bg-gray-300"
                      }
                    >
                      <TableCell>
                        <button
                          onClick={() =>
                            window.open(
                              `/f/findstudent?data=${encodeURIComponent(
                                JSON.stringify(student)
                              )}`,
                              "_blank",
                              "noopener,noreferrer"
                            )
                          }
                          className="text-blue-600 hover:underline cursor-pointer"
                        >
                          {student.rollNumber}
                        </button>
                      </TableCell>

                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.cgpa}</TableCell>
                      <TableCell>{student.percentage}%</TableCell>
                      <TableCell>{student.allActiveBacklogs}</TableCell>

                      {allSemesters.map((sem) => {
                        const semData = student.semesters.find(
                          (s) => s.semester === sem
                        );
                        return (
                          <TableCell key={sem} className="text-center">
                            {semData
                              ? (Math.floor(semData.sgpa * 100) / 100).toFixed(
                                  2
                                )
                              : "-"}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
};

export default MarksDashboard;
