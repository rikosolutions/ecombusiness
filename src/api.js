import axios from "axios";

const API_BASE_URL = "https://businessapi.lateshipment.com"; // update if backend runs elsewhere  3.85.211.188  127.0.0.1:8088

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

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, try to refresh
      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/refresh`,
          {},
          { withCredentials: true }
        );
        
        localStorage.setItem("access_token", refreshResponse.data.access_token);
        
        // Retry the original request
        error.config.headers.Authorization = `Bearer ${refreshResponse.data.access_token}`;
        return api.request(error.config);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem("access_token");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;


// src/api.js
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8088", 
//   withCredentials: true, 
// });

// export default api;

// src/api.js
