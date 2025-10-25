// src/pages/head/HeadDashboard.jsx
import React, { useEffect, useState } from "react";
import SideMenu from "../../components/SideMenu";
import Uploads from "./Uploads";
import Documents from "./Documents";
import HeadMessage from "./HeadMessage";

import { getAvailableYears } from "../../services/headService";

import PendingIdeas from "./ReviewProjects/PendingIdeas";
import ReviewedIdeas from "./ReviewProjects/ReviewedIdeas";
import ScheduleInterview from "./ReviewProjects/ScheduleInterview";
import InterviewStatus from "./ReviewProjects/InterviewStatus";


const HeadDashboard = () => {
  const [section, setSection] = useState("dashboard");
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [subTab, setSubTab] = useState("pending");

  // Fetch available years
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const data = await getAvailableYears();
        const yearList = data.map((y) => (typeof y === "string" ? y : y.year));
        setYears(yearList);
        if (yearList.length > 0) setSelectedYear(yearList[0]);
      } catch (err) {
        console.error("Error fetching years:", err);
      }
    };
    fetchYears();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideMenu activeMenu={section} setSection={setSection} />

      <div className="flex-1 p-6">
        {/* Academic Year Selector */}
        <div className="mb-6 flex items-center gap-4">
          <label className="font-medium">Select Academic Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border p-2 rounded"
          >
            {years.map((y, index) => (
              <option key={index} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Section Rendering */}
        {section === "dashboard" && <p>Welcome to the Head Dashboard</p>}
        {section === "uploads" && <Uploads />}
        {section === "documents" && <Documents />}
        {section === "messages" && <HeadMessage />}


        {section === "reviewProjects" && (
          <>
            {/* Sub Tabs */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setSubTab("pending")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  subTab === "pending"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-200"
                }`}
              >
                Pending Ideas
              </button>
              <button
                onClick={() => setSubTab("reviewed")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  subTab === "reviewed"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-200"
                }`}
              >
                Reviewed Ideas
              </button>
              <button
                onClick={() => setSubTab("interview")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  subTab === "interview"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-200"
                }`}
              >
                Schedule Interview
              </button>
              <button
                onClick={() => setSubTab("interviewstatus")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  subTab === "interviewstatus"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-200"
                }`}
              >
                Interview Status
              </button>
            </div>

            {/* Render SubTab Components */}
            {subTab === "pending" && (
              <PendingIdeas academicYear={selectedYear} />
            )}
            {subTab === "reviewed" && (
              <ReviewedIdeas academicYear={selectedYear} />
            )}
            {subTab === "interview" && (
              <ScheduleInterview academicYear={selectedYear} />
            )}
            {subTab === "interviewstatus" && (
              <InterviewStatus academicYear={selectedYear} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HeadDashboard;

