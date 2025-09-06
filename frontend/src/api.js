// frontend/src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // backend
  withCredentials: true,                // important for cookies/session
});

export default api;
