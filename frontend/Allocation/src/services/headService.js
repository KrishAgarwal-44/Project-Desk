// src/services/headService.js
import api from "../utils/axios";

/* -------------------- IDEA MANAGEMENT -------------------- */

// Fetch pending project ideas for a specific academic year
export const getPendingIdeasForHead = async (academicYear) => {
  const res = await api.get(`/head/pending-ideas`, {
    params: { academicYear },
  });
  return res.data;
};

// Review (approve or reject) a project idea
export const reviewIdeaByHead = async (ideaId, action, reason = "") => {
  const res = await api.put(`/head/idea-review/${ideaId}`, { action, reason });
  return res.data;
};

export const getReviewedIdeasForHead = async (academicYear) => {
  const res = await api.get("/head/idea-reviewed", {
    params: { academicYear },
  });
  return res.data;
};
/* -------------------- INTERVIEW MANAGEMENT -------------------- */

export const getAcceptedIdeasForInterview = async () => {
  const res = await api.get("/head/idea-accepted");
  return res.data;
};

// Schedule an interview for a project idea
export const scheduleInterview = async (id, interviewDetails) => {
  // interviewDetails = { date, time, location, notes }
  const res = await api.put(`/head/idea-interview/${id}`, interviewDetails);
  return res.data;
};

export const getScheduledInterviews = async (academicYear) => {
  const res = await api.get("/head/idea-scheduled-interviews", {
    params: academicYear ? { academicYear } : {},
  });
  return res.data;
};

// Review interview (pass / fail only, no feedback)
export const reviewInterview = async (id, action) => {
  const res = await api.put(`/head/idea-review-interview/${id}`, { action });
  return res.data;
};

/* -------------------- UPLOAD MANAGEMENT -------------------- */

// Upload Project Bank Excel file
export const uploadProjectBank = async (file, year) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("year", year);

  const res = await api.post("/head/upload-project-bank", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

// Upload Student List Excel file
export const uploadStudentList = async (file, year) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("year", year);

  const res = await api.post("/head/upload-student-list", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

// Upload Mentor List Excel file
export const uploadMentorList = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/head/upload-mentor-list", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

/* -------------------- YEAR MANAGEMENT -------------------- */

// Fetch available academic years
export const getAvailableYears = async () => {
  const res = await api.get("/head/years"); // <-- here is the API call
  return res.data;
};

export const getProjectsByYear = async (year) => {
  const res = await api.get("/head/projects", { params: { year } });
  return res.data;
};

/* -------------------- DOCUMENT MANAGEMENT -------------------- */

export const uploadDocument = async (file, title) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);

  const res = await api.post("/head/upload-document", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

// Get all uploaded documents
export const getDocuments = async () => {
  const res = await api.get(`/head/documents`);
  return res.data;
};

// Delete a document by ID
export const deleteDocument = async (id) => {
  const res = await api.delete(`/head/documents/${id}`);
  return res.data;
};

// Download a document by ID
export const downloadDocument = async (id, fileName) => {
  try {
    const response = await api.get(`/head/documents/download/${id}`, {
      responseType: "blob", // important for file download
    });

    // Create a link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName || "document");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Download error:", error);
    throw error;
  }
};

/* -------------------- MESSAGE MANAGEMENT -------------------- */
export const sendMessage = async (payload) => {
  if (!payload?.content || !payload?.receiverRoles?.length) {
    throw new Error("Invalid message data"); // This is where your error comes from
  }
  const res = await api.post("head/message/send", payload);
  return res.data;
};

export const getMessages = async () => {
  const res = await api.get("/head/message/get"); // 🔹 include /head prefix
  return res.data?.data || [];
};

/* -------------------- FORM 3 MANAGEMENT -------------------- */
// Head creates Form3 for all projects
export const createForm3ForAllProjects = async (weeks) => {
  const response = await api.post("/head/form3/create", { weeks });
  return response.data;
};
