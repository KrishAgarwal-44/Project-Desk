// src/services/authService.js
import axios from "axios";

const API = "http://localhost:8000/api/auth"; // adjust if backend base changes

// ✅ Login
export const login = async (formData) => {
  try {
    const response = await axios.post(`${API}/login`, formData);
    // backend should return { token, user }
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Login failed. Try again." };
  }
};


