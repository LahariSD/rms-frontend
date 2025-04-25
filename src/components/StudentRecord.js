import {
  Button,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

const StudentRecord = ({ student }) => {
  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600">
        <Typography variant="h5" className="text-white font-semibold">
          No student data available
        </Typography>
      </div>
    );
  }

  // Print function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        {/* Student Details */}
        <Card className="shadow-2xl rounded-2xl overflow-hidden mb-6">
          <CardContent className="p-6 bg-white">
            <Typography
              variant="h4"
              className="text-gray-800 font-bold text-center mb-4"
            >
              {student.name}
            </Typography>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <Typography className="font-medium">
                <span className="text-gray-900">Roll Number:</span>{" "}
                {student.rollNumber}
              </Typography>
              <Typography className="font-medium">
                <span className="text-gray-900">Department:</span>{" "}
                {student.department}
              </Typography>
              <Typography className="font-medium">
                <span className="text-gray-900">Batch:</span> {student.batch}
              </Typography>
              <Typography className="font-medium">
                <span className="text-gray-900">Student Type:</span>{" "}
                {student.type}
              </Typography>
              <Typography className="font-medium">
                <span className="text-gray-900">Active Backlogs:</span>{" "}
                {student.allActiveBacklogs}
              </Typography>
              <Typography className="font-medium">
                <span className="text-gray-900">
                  Total Backlogs (Present+Past):
                </span>{" "}
                {student.allBacklogs}
              </Typography>
              <Typography className="font-medium">
                <span className="text-gray-900">CGPA:</span>{" "}
                {Math.floor(student.cgpa * 100) / 100}
              </Typography>
              <Typography className="font-medium">
                <span className="text-gray-900">Percentage:</span>{" "}
                {student.percentage}%
              </Typography>
            </div>
          </CardContent>
        </Card>

        {/* Print Button */}
        <div className="mb-4 text-center">
          <Button variant="contained" color="primary" onClick={handlePrint}>
            Print Details
          </Button>
        </div>

        {/* Display each semester in a separate table */}
        {student.semesters.map((sem, index) => (
          <div key={index} className="mb-8 w-full">
            {/* Semester Heading with SGPA & Active Backlogs */}
            <div className="flex justify-between items-center mb-3">
              <Typography variant="h5" className="text-gray-800 font-bold">
                Semester {sem.semester} Results
              </Typography>
              <div className="flex gap-6">
                <Typography className="text-gray-700 font-medium">
                  <span className="text-gray-900">SGPA:</span>{" "}
                  {Number(sem.sgpa) ? Number(sem.sgpa).toFixed(2) : "N/A"}
                </Typography>
                <Typography className="text-gray-700 font-medium">
                  <span className="text-gray-900">Active Backlogs:</span>{" "}
                  {sem.activeBacklogs}
                </Typography>
              </div>
            </div>

            {/* Table for Each Semester */}
            <TableContainer component={Paper} className="shadow-md rounded-xl">
              <Table>
                <TableHead>
                  <TableRow className="bg-gray-400">
                    <TableCell className="font-bold text-gray-800">
                      Subject Name
                    </TableCell>
                    <TableCell className="font-bold text-gray-800">
                      Code
                    </TableCell>
                    <TableCell className="font-bold text-gray-800">
                      External
                    </TableCell>
                    <TableCell className="font-bold text-gray-800">
                      Internal
                    </TableCell>
                    <TableCell className="font-bold text-gray-800">
                      Total
                    </TableCell>
                    <TableCell className="font-bold text-gray-800">
                      Credits
                    </TableCell>
                    <TableCell className="font-bold text-gray-800">
                      Grade Points
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sem.subjects.length > 0 ? (
                    sem.subjects.map((subject, idx) => (
                      <TableRow
                        key={subject._id || idx}
                        className="hover:bg-gray-100 transition"
                      >
                        <TableCell>{subject.subjectName}</TableCell>
                        <TableCell>{subject.subjectCode}</TableCell>
                        <TableCell>{subject.externalMarks}</TableCell>
                        <TableCell>{subject.internalMarks}</TableCell>
                        <TableCell>{subject.totalMarks}</TableCell>
                        <TableCell>{subject.credits}</TableCell>
                        <TableCell>{subject.gradePoints}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan="7"
                        className="text-center text-gray-600"
                      >
                        No subjects available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentRecord;
