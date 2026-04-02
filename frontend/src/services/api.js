import axios from "axios";
import toast from "react-hot-toast";

// Use environment variables for production readiness
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Global Errors (like 401 Unauthorized)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Notify user before redirecting
      toast.error("Session expired. Please log in again.");
      
      // Redirect to login page
      window.location.href = "/login";
    }

    // You can handle 403 or 500 globally here too
    if (error.response?.status === 500) {
      toast.error("Internal Server Error. Our team has been notified.");
    }

    return Promise.reject(error);
  }
);

export default API;