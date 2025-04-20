import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { ADMIN_API_ENDPOINTS, API_BASE_URL } from "../../data/Constants";

export default function DisplaySubjects() {
  const [subjects, setSubjects] = useState([]);

  // 🔹 Fetch all subjects
  const fetchSubjects = async () => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}${ADMIN_API_ENDPOINTS.GET_ALL_SUBJECTS}`
      );
      //   sort them based on code
      const sortedSubjects = data.sort((a, b) => a.code.localeCompare(b.code));
      setSubjects(sortedSubjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📚 Subjects</h2>

      {/* create an input field to filter subjects based on all fields*/}
      <input
        type="text"
        className="block p-2 w-full mb-4"
        placeholder="Search subjects..."
        onChange={(e) => {
          const filteredSubjects = subjects.filter((subject) =>
            subject.code.includes(e.target.value)
          );
          setSubjects(filteredSubjects);
        }}
      />
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
