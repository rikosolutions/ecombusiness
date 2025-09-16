import axios from "axios";

const API_BASE_URL = "http://3.85.211.188"; // update if backend runs elsewhere

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ensures cookies (refresh_token) are sent
});

// Add Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;


// src/api.js
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8088", 
//   withCredentials: true, 
// });

// export default api;

// src/api.js
