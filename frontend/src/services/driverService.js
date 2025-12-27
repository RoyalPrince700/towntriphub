import axios from 'axios';

const API_URL = '/api/drivers';

// Get driver profile
export const getDriverProfile = async (token) => {
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
      message: error.response?.data?.message || 'Failed to fetch driver profile',
      status: error.response?.status
    };
  }
};

// Register as a driver
export const registerDriver = async (driverData, token) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    const response = await axios.post(`${API_URL}/register`, driverData, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to register as driver' };
  }
};

