import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  try {
    const authData = localStorage.getItem('tth_auth');
    if (authData) {
      const { token } = JSON.parse(authData);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle 401 Unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('tth_auth');
      
      // Only redirect if not already on the login page or other auth pages
      const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];
      const isPublicPath = publicPaths.some(path => window.location.pathname.startsWith(path));
      
      if (!isPublicPath) {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
