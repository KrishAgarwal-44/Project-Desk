// src/pages/head/Uploads.jsx
import React, { useState, useEffect, useRef } from "react";
import { getAvailableYears } from "../../services/headService";
import {
  uploadProjectBank,
  uploadStudentList,
  uploadMentorList,
} from "../../services/headService";

const Uploads = () => {
  const [academicYear, setAcademicYear] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const [loadingYears, setLoadingYears] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Refs for file inputs to reset after upload
  const projectBankRef = useRef(null);
  const studentListRef = useRef(null);
  const mentorListRef = useRef(null);

  useEffect(() => {
    const fetchYears = async () => {
      setLoadingYears(true);
      try {
        const data = await getAvailableYears();
        setAvailableYears(data);
        if (data.length > 0) setAcademicYear(data[0].year);
      } catch (err) {
        console.error("Error fetching academic years:", err);
      } finally {
        setLoadingYears(false);
      }
    };
    fetchYears();
  }, []);

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      if (type === "projectBank") await uploadProjectBank(file, academicYear);
      else if (type === "studentList")
        await uploadStudentList(file, academicYear);
      else if (type === "mentorList")
        await uploadMentorList(file);

      alert(`${type} uploaded successfully!`);
    } catch (err) {
      console.error(err);
      alert(`Failed to upload ${type}.`);
    } finally {
      setUploading(false);
      // Reset file input
      if (type === "projectBank") projectBankRef.current.value = "";
      else if (type === "studentList") studentListRef.current.value = "";
      else if (type === "mentorList") mentorListRef.current.value = "";
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Upload Files</h2>

      <div className="space-y-4">
        <div>
          <label className="font-semibold block mb-1">Upload Project Bank:</label>
          <input
            ref={projectBankRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => handleFileUpload(e, "projectBank")}
            disabled={uploading}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="font-semibold block mb-1">Upload Student List:</label>
          <input
            ref={studentListRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => handleFileUpload(e, "studentList")}
            disabled={uploading}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="font-semibold block mb-1">Upload Mentor List:</label>
          <input
            ref={mentorListRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => handleFileUpload(e, "mentorList")}
            disabled={uploading}
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      {uploading && <p className="mt-4 text-blue-600">Uploading file...</p>}
    </div>
  );
};

export default Uploads;
