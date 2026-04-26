const googleMapsService = require('../services/googleMapsService');
const asyncHandler = require('express-async-handler');

const getPlaceAutocomplete = asyncHandler(async (req, res) => {
  const { input, lat, lng } = req.query;

  if (!input || input.length < 2) {
    return res.status(400).json({
      error: 'Input parameter is required and must be at least 2 characters'
    });
  }

  let location = null;
  if (lat && lng) {
    location = { lat: parseFloat(lat), lng: parseFloat(lng) };
  }

  const suggestions = await googleMapsService.getPlaceAutocomplete(input, location);

  res.json({
    success: true,
    data: suggestions
  });
});

const getPlaceDetails = asyncHandler(async (req, res) => {
  const { placeId } = req.params;

  if (!placeId) {
    return res.status(400).json({
      error: 'Place ID is required'
    });
  }

  const placeDetails = await googleMapsService.getPlaceDetails(placeId);

  res.json({
    success: true,
    data: placeDetails
  });
});

const getDirections = asyncHandler(async (req, res) => {
  const { pickupLat, pickupLng, destinationLat, destinationLng, mode } = req.query;

  if (!pickupLat || !pickupLng || !destinationLat || !destinationLng) {
    return res.status(400).json({
      error: 'Pickup and destination coordinates are required'
    });
  }

  const origin = `${pickupLat},${pickupLng}`;
  const destination = `${destinationLat},${destinationLng}`;

  const directions = await googleMapsService.getDirections(origin, destination, mode || 'driving');

  res.json({
    success: true,
    data: directions
  });
});

module.exports = {
  getPlaceAutocomplete,
  getPlaceDetails,
  getDirections
};