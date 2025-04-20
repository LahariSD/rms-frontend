import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import StudentRecord from "../../components/StudentRecord";
import { API_BASE_URL, STUDENT_API_ENDPOINTS } from "../../data/Constants";

const FindStudent = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [error, setError] = useState("");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const studentData = queryParams.get("data"); // Get encoded JSON string

  // Parse the JSON string to get the object
  useEffect(() => {
    if (studentData) {
      const student = JSON.parse(decodeURIComponent(studentData));
      setStudent(student);
    }
  }, [studentData]);

  const handleSearch = async () => {
    if (rollNumber.length !== 9) {
      setError("Roll number must be exactly 09 characters.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await axios.get(
        `${API_BASE_URL}${STUDENT_API_ENDPOINTS.GET_ALL_STUDENT_RESULTS}/${rollNumber}`
      );

      if (res.data.length > 0) {
        setStudent(res.data[0]);
      } else {
        setError("Student not found.");
        setStudent(null);
      }
    } catch (err) {
      setError("Error searching for student.");
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200 p-6">
      <Card className="shadow-2xl p-8 w-full max-w-3xl bg-white rounded-lg">
        <CardContent>
          <Typography
            variant="h4"
            className="font-bold text-gray-800 text-center mb-6"
          >
            Find Student Record
          </Typography>

          <TextField
            fullWidth
            label="Enter 09-character Roll Number"
            variant="outlined"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            error={!!error}
            helperText={error}
            inputProps={{ maxLength: 9 }}
            className="mb-4"
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSearch}
            className="mt-2 py-2 text-lg"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Find"}
          </Button>
        </CardContent>
      </Card>

      {student && (
        <div className="mt-6 w-full max-w-4xl">
          <StudentRecord student={student} />
        </div>
      )}
    </div>
  );
};

export default FindStudent;
