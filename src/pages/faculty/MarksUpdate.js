import {
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Loader from "../../components/Loader";
import {
  academicRegulations,
  API_BASE_URL,
  FACULTY_API_ENDPOINTS,
} from "../../data/Constants";

import { CheckCircle, Error, Warning } from "@mui/icons-material";

const MarksUpdate = () => {
  const [semester, setSemester] = useState("");
  const [studentsType, setStudentsType] = useState("");
  const [regulation, setRegulation] = useState("");
  const [file, setFile] = useState(null);
  const [examType, setExamType] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("semester", semester);
    formData.append("type", studentsType);
    formData.append("file", file);
    formData.append("regulation", regulation);
    formData.append("examType", examType);

    setLoading(true);
    setResponse(null);

    let ApiEndpoint = `${
      examType === "Supply"
        ? FACULTY_API_ENDPOINTS.UPDATE_SUPPLY_RECORDS
        : studentsType === "lateral" && semester === 3
        ? FACULTY_API_ENDPOINTS.CREATE_STUDENT_RECORDS
        : semester !== 1
        ? FACULTY_API_ENDPOINTS.UPDATE_STUDENT_RECORDS
        : FACULTY_API_ENDPOINTS.CREATE_STUDENT_RECORDS
    }`;

    const isUpdateOperation =
      ApiEndpoint === FACULTY_API_ENDPOINTS.UPDATE_SUPPLY_RECORDS ||
      ApiEndpoint === FACULTY_API_ENDPOINTS.UPDATE_STUDENT_RECORDS;

    ApiEndpoint = `${API_BASE_URL}${ApiEndpoint}`;

    try {
      const res = await fetch(ApiEndpoint, {
        method: isUpdateOperation ? "PATCH" : "POST", // Use PATCH for updates
        body: formData,
      });

      const result = await res.json();
      setLoading(false);

      if (res.status === 201 || res.status === 207 || res.status === 200) {
        setResponse({ success: true, data: result });

        // Clear the form after success
        setSemester("");
        setStudentsType("");
        setRegulation("");
        setExamType("");
        setFile(null);
      } else if (res.status === 409) {
        setResponse({
          success: false,
          message: "All records were duplicates.",
        });
      } else if (res.status === 400) {
        setResponse({ success: false, message: "Invalid file data." });
      } else {
        setResponse({ success: false, message: result.message });
      }
    } catch (error) {
      setLoading(false);
      setResponse({ success: false, message: "Upload failed. Try again." });
    }
  };

  const StudentUploadResult = ({ response }) => {
    if (!response) return null;

    const { success, data, message } = response;
    const {
      noOfRecordsUpdated,
      missedEntries,
      skippedEntries,
      duplicateEntries,
      noOfRecordsSaved,
    } = data || {};

    return (
      <div className="flex justify-center items-center mt-6">
        <Card
          className={`w-full max-w-4xl p-6 rounded-lg shadow-md border-l-4 ${
            success
              ? "border-green-500 bg-green-50"
              : "border-red-500 bg-red-50"
          }`}
        >
          <CardContent>
            {/* Message & Status Icon */}
            <div className="flex items-center mb-4">
              {success ? (
                <CheckCircle className="text-green-600 mr-2" fontSize="large" />
              ) : (
                <Error className="text-red-600 mr-2" fontSize="large" />
              )}
              <Typography
                variant="h6"
                className={success ? "text-green-700" : "text-red-700"}
              >
                {success ? data.message : message}
              </Typography>
            </div>

            {/* Number of Records Updated */}
            {success && noOfRecordsUpdated !== undefined && (
              <Typography variant="body1" className="mb-4 text-gray-700">
                ✅ <strong>{noOfRecordsUpdated}</strong> records were
                successfully updated.
              </Typography>
            )}

            {/* No of records saved  with dashboard link*/}
            {success && noOfRecordsSaved !== undefined && (
              <Typography variant="body1" className="mb-4 text-gray-700">
                <strong>{noOfRecordsSaved}</strong> records were saved
                successfully. You can view the records on the{" "}
                <a
                  className="text-blue-600 hover:text-blue-800"
                  href="/f/dashboard"
                >
                  Dashboard
                </a>{" "}
                page.
              </Typography>
            )}

            {/* Missed Entries Table */}
            {missedEntries?.length > 0 && (
              <div className="mt-4">
                <Typography
                  variant="h6"
                  className="text-red-700 flex items-center"
                >
                  <Warning className="mr-2" /> Missed Entries (Not Found)
                </Typography>
                <Table className="mt-2">
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-semibold">Regd No</TableCell>
                      <TableCell className="font-semibold">Reason</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {missedEntries.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell>{entry.regdno}</TableCell>
                        <TableCell className="text-red-600">
                          {entry.reason}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Duplicate entries table */}
            {duplicateEntries?.length > 0 && (
              <div className="mt-4">
                <Typography
                  variant="h6"
                  className="text-green-700 flex items-center"
                >
                  <Warning className="mr-2" /> Duplicate Entries (Not Found)
                </Typography>
                <Table className="mt-2">
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-semibold">Regd No</TableCell>
                      <TableCell className="font-semibold">Reason</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {duplicateEntries.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell>{entry}</TableCell>
                        <TableCell className="text-red-600">
                          Repeated Entry
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Skipped Entries Table */}
            {skippedEntries?.length > 0 && (
              <div className="mt-4">
                <Typography
                  variant="h6"
                  className="text-yellow-700 flex items-center"
                >
                  <Warning className="mr-2" /> Skipped Entries (Already Exists)
                </Typography>
                <Table className="mt-2">
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-semibold">Regd No</TableCell>
                      <TableCell className="font-semibold">Reason</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {skippedEntries.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell>{entry.regdno}</TableCell>
                        <TableCell className="text-yellow-600">
                          {entry.reason}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Upload/Update Student Results
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <FormControl fullWidth>
            <InputLabel>Select Exam Category</InputLabel>
            <Select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              label="Select Exam Category"
            >
              <MenuItem value="Regular">Regular</MenuItem>
              <MenuItem value="Supply">Supply</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Students Type</InputLabel>
            <Select
              value={studentsType}
              onChange={(e) => setStudentsType(e.target.value)}
              label="Students Type"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="regular">Regular</MenuItem>
              <MenuItem value="lateral">Lateral</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Semester</InputLabel>
            <Select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              label="Semester"
            >
              {[...Array(studentsType === "lateral" ? 6 : 8)].map((_, i) => {
                const semesterValue =
                  studentsType === "lateral" ? i + 3 : i + 1;
                return (
                  <MenuItem key={semesterValue} value={semesterValue}>
                    {semesterValue}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Regulation</InputLabel>
            <Select
              value={regulation}
              onChange={(e) => setRegulation(e.target.value)}
              label="Regulation"
            >
              {academicRegulations.map((reg) => (
                <MenuItem key={reg.value} value={reg.value}>
                  {reg.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="mt-4">
          <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        </div>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="mt-4 w-full"
          disabled={!semester || !studentsType || !file}
        >
          Upload
        </Button>
      </form>

      {response && <StudentUploadResult response={response} />}
    </div>
  );
};

export default MarksUpdate;
