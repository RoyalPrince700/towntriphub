import api from './api';

// Saved Places Services
export const createSavedPlace = async (savedPlaceData) => {
  const response = await api.post('/saved-places', savedPlaceData);
  return response.data;
};

export const getUserSavedPlaces = async (type = null) => {
  const params = type ? { type } : {};
  const response = await api.get('/saved-places', { params });
  return response.data;
};

export const updateSavedPlace = async (placeId, updateData) => {
  const response = await api.put(`/saved-places/${placeId}`, updateData);
  return response.data;
};

export const deleteSavedPlace = async (placeId) => {
  const response = await api.delete(`/saved-places/${placeId}`);
  return response.data;
};

export const incrementSavedPlaceUsage = async (placeId) => {
  const response = await api.put(`/saved-places/${placeId}/usage`);
  return response.data;
};

export default {
  createSavedPlace,
  getUserSavedPlaces,
  updateSavedPlace,
  deleteSavedPlace,
  incrementSavedPlaceUsage,
};