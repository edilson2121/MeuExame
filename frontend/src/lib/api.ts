import axios from 'axios';

// Get API URL based on environment
const getApiUrl = () => {
  // In browser context
  if (typeof window !== 'undefined') {
    // In production (with nginx), use relative URL
    if (process.env.NODE_ENV === 'production') {
      return '/api';
    }
    // In development, use configured URL or default
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  }
  // Server-side
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
};

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;