import api from './api';

// Get driver profile
export const getDriverProfile = async () => {
  try {
    const response = await api.get('/drivers/profile');
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch driver profile',
      status: error.response?.status
    };
  }
};

// Register as a driver
export const registerDriver = async (driverData) => {
  try {
    const response = await api.post('/drivers/register', driverData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to register as driver' };
  }
};

// Get driver assignments
export const getDriverAssignments = async (status = '') => {
  const response = await api.get('/drivers/assignments', {
    params: { status }
  });
  return response.data;
};

// Get driver statistics
export const getDriverStatistics = async () => {
  const response = await api.get('/drivers/statistics');
  return response.data;
};

// Get driver earnings
export const getDriverEarnings = async () => {
  const response = await api.get('/drivers/earnings');
  return response.data;
};

// Update driver availability status
export const updateDriverAvailability = async (availabilityStatus) => {
  const response = await api.put('/drivers/availability', { availabilityStatus });
  return response.data;
};

// Update trip status
export const updateTripStatus = async (bookingId, status) => {
  const response = await api.put(`/drivers/assignments/${bookingId}/status`, { status });
  return response.data;
};

export default {
  getDriverProfile,
  registerDriver,
  getDriverAssignments,
  getDriverStatistics,
  getDriverEarnings,
  updateDriverAvailability,
  updateTripStatus,
};

