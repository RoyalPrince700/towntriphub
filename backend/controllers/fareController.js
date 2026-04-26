const asyncHandler = require('express-async-handler');
const DistanceCalculator = require('../utils/distanceCalculator');
const FareCalculator = require('../utils/fareCalculator');

/**
 * Calculate fare estimate for booking
 */
const calculateFareEstimate = asyncHandler(async (req, res) => {
  const {
    pickupLat,
    pickupLng,
    destinationLat,
    destinationLng,
    vehicleType = 'standard',
    surgeType = 'normal'
  } = req.body;

  // Validate required coordinates
  if (!pickupLat || !pickupLng || !destinationLat || !destinationLng) {
    return res.status(400).json({
      error: 'Pickup and destination coordinates are required'
    });
  }

  // Validate coordinates are numbers
  const coords = [pickupLat, pickupLng, destinationLat, destinationLng];
  if (coords.some(coord => isNaN(parseFloat(coord)))) {
    return res.status(400).json({
      error: 'Invalid coordinate values'
    });
  }

  try {
    const pickupCoords = {
      latitude: parseFloat(pickupLat),
      longitude: parseFloat(pickupLng)
    };

    const destinationCoords = {
      latitude: parseFloat(destinationLat),
      longitude: parseFloat(destinationLng)
    };

    // Calculate distance and fare
    const fareEstimate = FareCalculator.calculateFareEstimate(
      pickupCoords,
      destinationCoords,
      vehicleType,
      surgeType
    );

    res.json({
      success: true,
      data: fareEstimate
    });

  } catch (error) {
    console.error('Fare calculation error:', error);
    res.status(500).json({
      error: 'Failed to calculate fare estimate'
    });
  }
});

/**
 * Get fare ranges for different vehicle types
 */
const getFareRanges = asyncHandler(async (req, res) => {
  const { pickupLat, pickupLng, destinationLat, destinationLng } = req.query;

  if (!pickupLat || !pickupLng || !destinationLat || !destinationLng) {
    return res.status(400).json({
      error: 'Pickup and destination coordinates are required'
    });
  }

  try {
    const pickupCoords = {
      latitude: parseFloat(pickupLat),
      longitude: parseFloat(pickupLng)
    };

    const destinationCoords = {
      latitude: parseFloat(destinationLat),
      longitude: parseFloat(destinationLng)
    };

    const fareRanges = FareCalculator.getFareRanges(pickupCoords, destinationCoords);

    res.json({
      success: true,
      data: fareRanges
    });

  } catch (error) {
    console.error('Fare ranges calculation error:', error);
    res.status(500).json({
      error: 'Failed to calculate fare ranges'
    });
  }
});

/**
 * Get pricing configuration
 */
const getPricingConfig = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      baseFares: FareCalculator.baseFares,
      pricePerKm: FareCalculator.pricePerKm,
      pricePerMinute: FareCalculator.pricePerMinute,
      minimumFare: FareCalculator.minimumFare,
      surgeMultipliers: FareCalculator.surgeMultipliers,
      currency: 'GMD'
    }
  });
});

module.exports = {
  calculateFareEstimate,
  getFareRanges,
  getPricingConfig
};