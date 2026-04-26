import api from './api';

export const adminMonitoringService = {
  getActiveTrips: async () => {
    try {
      const response = await api.get('/admin-monitoring/active-trips');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch active trips:', error);
      throw error;
    }
  },

  getTripStatistics: async () => {
    try {
      const response = await api.get('/admin-monitoring/statistics');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch trip statistics:', error);
      throw error;
    }
  }
};
