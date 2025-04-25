import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    // Add any common headers here
  }
});

// Add request interceptors
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      console.error('Unauthorized access');
      // Optionally redirect to login
    }
    else if (error.response?.status === 409) {
      // console.log(error.response.data.error);
      return Promise.reject({
        ...error,
        message: error.response?.data?.error || 'Dữ liệu đã tồn tại trong hệ thống'
      });
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
