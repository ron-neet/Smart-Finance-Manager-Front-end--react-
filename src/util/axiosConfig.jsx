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
      if (error.response.status === 401 && !error.config.url.includes("/login")) {
        console.error("Unauthorized! Redirecting to login...");
        window.location.href = "/login";
      } else if (error.response.status === 500) {
        alert("Server Error! Please try again later.");
      } else if (error.response.status === 403) {
        alert("Forbidden! You don't have permission to access this resource.");
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