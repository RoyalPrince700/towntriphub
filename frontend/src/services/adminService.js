import api from './api';

// Admin Dashboard Statistics
export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

// Analytics Data
export const getAnalytics = async (period = 30) => {
  const response = await api.get('/admin/analytics', { params: { period } });
  return response.data;
};

// Bookings Management
export const getAllBookings = async (params = {}) => {
  const response = await api.get('/bookings/admin', { params });
  return response.data;
};

export const assignDriver = async (bookingId, driverId, price) => {
  const response = await api.put(`/bookings/${bookingId}/assign-driver`, {
    driverId,
    price,
  });
  return response.data;
};

export const getAvailableDrivers = async (params = {}) => {
  const response = await api.get('/bookings/available-drivers', { params });
  return response.data;
};

// Logistics Orders Management
export const assignLogisticsPersonnel = async (bookingId, personnelId, price) => {
  const response = await api.put(`/bookings/${bookingId}/assign-logistics`, {
    personnelId,
    price,
  });
  return response.data;
};

export const getAvailableLogisticsPersonnel = async () => {
  const response = await api.get('/bookings/available-logistics');
  return response.data;
};

// Driver Management
export const getAllDrivers = async (params = {}) => {
  const response = await api.get('/drivers', { params });
  return response.data;
};

export const updateDriverApproval = async (driverId, action, reason = '') => {
  const response = await api.put(`/drivers/${driverId}/approval`, {
    action,
    reason,
  });
  return response.data;
};

export const updateDriverSuspension = async (driverId, action, reason = '') => {
  const response = await api.put(`/drivers/${driverId}/suspension`, {
    action,
    reason,
  });
  return response.data;
};

// Logistics Personnel Management
export const getAllLogisticsPersonnel = async (params = {}) => {
  const response = await api.get('/logistics', { params });
  return response.data;
};

export const updateLogisticsApproval = async (personnelId, action, reason = '') => {
  const response = await api.put(`/logistics/${personnelId}/approval`, {
    action,
    reason,
  });
  return response.data;
};

export const updateLogisticsSuspension = async (personnelId, action, reason = '') => {
  const response = await api.put(`/logistics/${personnelId}/suspension`, {
    action,
    reason,
  });
  return response.data;
};

// User Management (if needed)
export const getAllUsers = async (params = {}) => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

export const updateUserStatus = async (userId, status) => {
  const response = await api.put(`/admin/users/${userId}/status`, { status });
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await api.put(`/admin/users/${userId}/role`, { role });
  return response.data;
};

export default {
  getAdminStats,
  getAnalytics,
  getAllBookings,
  assignDriver,
  getAvailableDrivers,
  assignLogisticsPersonnel,
  getAvailableLogisticsPersonnel,
  getAllDrivers,
  updateDriverApproval,
  updateDriverSuspension,
  getAllLogisticsPersonnel,
  updateLogisticsApproval,
  updateLogisticsSuspension,
  getAllUsers,
  updateUserStatus,
  updateUserRole,
};
