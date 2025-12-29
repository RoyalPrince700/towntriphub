import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Axios instance with auth token support
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    console.error('Error getting auth token for reviews:', error);
  }
  return config;
});

export const createReview = async (reviewData) => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};

export const getUserReviews = async (userId, params = {}) => {
  const response = await api.get(`/reviews/user/${userId}`, { params });
  return response.data;
};

export const getGivenReviews = async (params = {}) => {
  const response = await api.get('/reviews/given', { params });
  return response.data;
};

export const getUserRatingStats = async (userId) => {
  const response = await api.get(`/reviews/stats/${userId}`);
  return response.data;
};

export default {
  createReview,
  getUserReviews,
  getGivenReviews,
  getUserRatingStats,
};

