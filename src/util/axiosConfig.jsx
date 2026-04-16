import axios from "axios";

const axiosConfig = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const excludedEndpoints = ["/login", "/register", "/health"];

axiosConfig.interceptors.request.use(
  (config) => {
    const shouldSkipToken = excludedEndpoints.some((endpoint) => {
      return config.url?.includes(endpoint)
    });

    if (!shouldSkipToken) { 
      const accessToken = localStorage.getItem("token");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const originalRequest = error.config;

      // Handle Unauthorized (401) and Forbidden (403)
      if ((status === 401 || status === 403) && !originalRequest.url.includes("/login")) {
        console.error(`${status === 401 ? 'Unauthorized' : 'Forbidden'}! Redirecting to login...`);
        
        // Clear expired session data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Redirect if not already on login page
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      } else if (status === 500) {
        console.error("Internal Server Error");
      }
    } else if (error.request) {
      alert("No response from server. Please check your network.");
    } else {
      console.error("Error setting up request:", error.message);
    }

    return Promise.reject(error);
  }
);


export default axiosConfig;