import axios from "axios";

const instance = axios.create({
  baseURL: "https://project-desk-backend.onrender.com", // change to your backend URL
});

// Automatically attach JWT token if available
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
