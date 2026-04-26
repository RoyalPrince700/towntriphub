import api from './api';

export const placesService = {
  // Google Places Autocomplete
  getAutocomplete: async (input, location = null) => {
    try {
      const params = new URLSearchParams({ input });

      if (location) {
        params.append('lat', location.lat);
        params.append('lng', location.lng);
      }

      const response = await api.get(`/places/autocomplete?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Places autocomplete error:', error);
      throw error;
    }
  },

  // Get place details
  getPlaceDetails: async (placeId) => {
    try {
      const response = await api.get(`/places/details/${placeId}`);
      return response.data.data;
    } catch (error) {
      console.error('Place details error:', error);
      throw error;
    }
  },

  // Calculate fare estimate (cost-optimized approach)
  calculateFareEstimate: async (pickupCoords, destinationCoords, vehicleType = 'standard', surgeType = 'normal') => {
    try {
      const response = await api.post('/fare/estimate', {
        pickupLat: pickupCoords.latitude,
        pickupLng: pickupCoords.longitude,
        destinationLat: destinationCoords.latitude,
        destinationLng: destinationCoords.longitude,
        vehicleType,
        surgeType
      });
      return response.data.data;
    } catch (error) {
      console.error('Fare estimate calculation error:', error);
      throw error;
    }
  },

  // Get fare ranges for different vehicle types
  getFareRanges: async (pickupCoords, destinationCoords) => {
    try {
      const params = new URLSearchParams({
        pickupLat: pickupCoords.latitude,
        pickupLng: pickupCoords.longitude,
        destinationLat: destinationCoords.latitude,
        destinationLng: destinationCoords.longitude
      });

      const response = await api.get(`/fare/ranges?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Fare ranges error:', error);
      throw error;
    }
  },

  // Get directions for route display
  getDirections: async (pickupCoords, destinationCoords, mode = 'driving') => {
    try {
      const params = new URLSearchParams({
        pickupLat: pickupCoords.latitude,
        pickupLng: pickupCoords.longitude,
        destinationLat: destinationCoords.latitude,
        destinationLng: destinationCoords.longitude,
        mode
      });

      const response = await api.get(`/places/directions?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Directions error:', error);
      throw error;
    }
  }
};