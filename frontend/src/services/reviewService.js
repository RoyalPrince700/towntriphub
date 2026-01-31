import api from './api';

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

