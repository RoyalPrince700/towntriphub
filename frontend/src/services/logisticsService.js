import axios from 'axios';

const API_URL = '/api/logistics';

function authConfig(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

// Get logistics profile
export const getLogisticsProfile = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/profile`, authConfig(token));
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch logistics profile',
      status: error.response?.status
    };
  }
};

export const getLogisticsStatistics = async (token) => {
  const response = await axios.get(`${API_URL}/statistics`, authConfig(token));
  return response.data;
};

export const getLogisticsAssignments = async (token, { status, page, limit } = {}) => {
  const params = {};
  if (status) params.status = status;
  if (page) params.page = page;
  if (limit) params.limit = limit;
  const response = await axios.get(`${API_URL}/assignments`, {
    ...authConfig(token),
    params,
  });
  return response.data;
};

export const updateLogisticsAssignmentStatus = async (token, bookingId, payload) => {
  const response = await axios.put(
    `${API_URL}/assignments/${bookingId}/status`,
    payload,
    authConfig(token)
  );
  return response.data;
};

export const getLogisticsEarnings = async (token) => {
  const response = await axios.get(`${API_URL}/earnings`, authConfig(token));
  return response.data;
};

// Register as logistics personnel
export const registerLogisticsPersonnel = async (logisticsData, token) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    const response = await axios.post(`${API_URL}/register`, logisticsData, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to register as logistics' };
  }
};

