import axios from 'axios';

const API_URL = '/api/logistics';

// Get logistics profile
export const getLogisticsProfile = async (token) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${API_URL}/profile`, config);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch logistics profile',
      status: error.response?.status
    };
  }
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

