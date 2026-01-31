import api from './api';

// Get logistics profile
export const getLogisticsProfile = async () => {
  try {
    const response = await api.get('/logistics/profile');
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch logistics profile',
      status: error.response?.status
    };
  }
};

export const getLogisticsStatistics = async () => {
  const response = await api.get('/logistics/statistics');
  return response.data;
};

export const getLogisticsAssignments = async ({ status, page, limit } = {}) => {
  const params = {};
  if (status) params.status = status;
  if (page) params.page = page;
  if (limit) params.limit = limit;
  const response = await api.get('/logistics/assignments', {
    params,
  });
  return response.data;
};

export const updateLogisticsAssignmentStatus = async (bookingId, payload) => {
  const response = await api.put(
    `/logistics/assignments/${bookingId}/status`,
    payload
  );
  return response.data;
};

export const getLogisticsEarnings = async () => {
  const response = await api.get('/logistics/earnings');
  return response.data;
};

// Register as logistics personnel
export const registerLogisticsPersonnel = async (logisticsData) => {
  try {
    const response = await api.post('/logistics/register', logisticsData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to register as logistics' };
  }
};

