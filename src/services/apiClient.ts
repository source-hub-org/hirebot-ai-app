import axios from "axios";

// Use relative URL for API requests to leverage Next.js rewrites
const apiClient = axios.create({
  baseURL: "/api", // This will be rewritten by Next.js to the actual API URL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    // Add any common headers here
  },
  withCredentials: true, // Include cookies in cross-site requests
});

// Add request interceptors
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("authToken")
        : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      console.error("Unauthorized access");
      // Optionally redirect to login
    } else if (error.response?.status === 409) {
      // console.log(error.response.data.error);
      return Promise.reject({
        ...error,
        message:
          error.response?.data?.error || "Dữ liệu đã tồn tại trong hệ thống",
      });
    }

    return Promise.reject({
      ...error,
      message: error.response?.data?.error,
    });
  },
);

export default apiClient;
