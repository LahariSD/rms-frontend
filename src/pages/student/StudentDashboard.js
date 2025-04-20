import axios from "axios";
import React, { useEffect, useState } from "react";
import StudentRecord from "../../components/StudentRecord";
import { API_BASE_URL, STUDENT_API_ENDPOINTS } from "../../data/Constants";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors

  const email = localStorage.getItem("email");
  const rollNumber = email ? email.split("@")[0] : null;

  useEffect(() => {
    if (!rollNumber) {
      setError("No roll number found. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchStudentData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}${STUDENT_API_ENDPOINTS.GET_ALL_STUDENT_RESULTS}/${rollNumber}`
        );
        setStudent(response.data[0]);
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError("Failed to load student data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [rollNumber]);

  console.log(student);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-700 text-lg">Loading student data...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      ) : (
        <StudentRecord student={student} />
      )}
    </>
  );
};

export default StudentDashboard;
