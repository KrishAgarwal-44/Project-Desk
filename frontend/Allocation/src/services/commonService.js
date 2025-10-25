// src/services/commonService.js
import api from "../utils/axios";

// ✅ Get available students
export const getAvailableStudents = async () => {
  const res = await api.get("/common/students");
  return res.data.students; // ✅ must return students
};

export const getAvailableMentors = async () => {
  const res = await api.get("/common/mentors");
  return res.data.mentors; // ✅ must return mentors
};

// Get messages (for all roles: head, mentor, student)
export const getMessages = async () => {
  const res = await api.get("/common/messages");
  return res.data.data || []; // directly return array of messages
};