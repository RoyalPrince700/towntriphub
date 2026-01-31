import api from './api';

// Booking Services
export const createRideBooking = async (bookingData) => {
  const response = await api.post('/bookings/ride', bookingData);
  return response.data;
};

export const createDeliveryBooking = async (bookingData) => {
  const response = await api.post('/bookings/delivery', bookingData);
  return response.data;
};

export const getUserBookings = async (params = {}) => {
  const response = await api.get('/bookings', { params });
  return response.data;
};

export const getBookingDetails = async (bookingId) => {
  const response = await api.get(`/bookings/${bookingId}`);
  return response.data;
};

export const cancelBooking = async (bookingId, reason) => {
  const response = await api.put(`/bookings/${bookingId}/cancel`, { reason });
  return response.data;
};

export const confirmPayment = async (bookingId) => {
  const response = await api.put(`/bookings/${bookingId}/confirm-payment`);
  return response.data;
};

export const getBookingStats = async () => {
  const response = await api.get('/bookings/stats');
  return response.data;
};

export default {
  createRideBooking,
  createDeliveryBooking,
  getUserBookings,
  getBookingDetails,
  cancelBooking,
  confirmPayment,
  getBookingStats,
};
