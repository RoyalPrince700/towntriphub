/**
 * Fare Calculator for TownTripHub
 * Calculates fares based on distance, duration, and vehicle type
 */

class FareCalculator {
  constructor() {
    // Base fares in GMD (Gambian Dalasi)
    this.baseFares = {
      standard: 50,
      premium: 75,
      van: 100,
      truck: 150
    };

    // Price per kilometer in GMD
    this.pricePerKm = {
      standard: 25,
      premium: 35,
      van: 40,
      truck: 60
    };

    // Price per minute in GMD (for time-based pricing)
    this.pricePerMinute = {
      standard: 2,
      premium: 3,
      van: 2.5,
      truck: 4
    };

    // Minimum fare in GMD
    this.minimumFare = {
      standard: 75,
      premium: 100,
      van: 125,
      truck: 200
    };

    // Surge pricing multipliers
    this.surgeMultipliers = {
      normal: 1.0,
      peak: 1.5,      // 50% increase during peak hours
      high_demand: 2.0, // 100% increase during high demand
      emergency: 3.0    // 200% increase for emergency rides
    };
  }

  /**
   * Calculate fare for a trip
   * @param {number} distanceInMeters - Distance in meters
   * @param {number} durationInSeconds - Estimated duration in seconds
   * @param {string} vehicleType - 'standard', 'premium', 'van', 'truck'
   * @param {string} surgeType - 'normal', 'peak', 'high_demand', 'emergency'
   * @returns {Object} fare breakdown
   */
  calculateFare(distanceInMeters, durationInSeconds, vehicleType = 'standard', surgeType = 'normal') {
    // Validate inputs
    if (!this.baseFares[vehicleType]) {
      throw new Error(`Invalid vehicle type: ${vehicleType}`);
    }

    if (!this.surgeMultipliers[surgeType]) {
      throw new Error(`Invalid surge type: ${surgeType}`);
    }

    // Convert distance to kilometers
    const distanceKm = distanceInMeters / 1000;

    // Convert duration to minutes
    const durationMinutes = durationInSeconds / 60;

    // Calculate base components
    const baseFare = this.baseFares[vehicleType];
    const distanceCost = distanceKm * this.pricePerKm[vehicleType];
    const timeCost = durationMinutes * this.pricePerMinute[vehicleType];

    // Calculate subtotal before surge
    const subtotal = baseFare + distanceCost + timeCost;

    // Apply surge pricing
    const surgeMultiplier = this.surgeMultipliers[surgeType];
    const surgeAmount = subtotal * (surgeMultiplier - 1);
    const totalAfterSurge = subtotal * surgeMultiplier;

    // Apply minimum fare rule
    const minimumFare = this.minimumFare[vehicleType];
    const finalTotal = Math.max(totalAfterSurge, minimumFare);

    // Calculate platform fee (10% of final total)
    const platformFee = finalTotal * 0.1;
    const driverEarnings = finalTotal - platformFee;

    return {
      currency: 'GMD',
      components: {
        baseFare: Math.round(baseFare),
        distanceCost: Math.round(distanceCost),
        timeCost: Math.round(timeCost),
        surgeAmount: Math.round(surgeAmount),
        platformFee: Math.round(platformFee)
      },
      totals: {
        subtotal: Math.round(subtotal),
        totalAfterSurge: Math.round(totalAfterSurge),
        finalTotal: Math.round(finalTotal),
        driverEarnings: Math.round(driverEarnings)
      },
      breakdown: {
        distance: `${distanceKm.toFixed(1)} km`,
        duration: `${Math.round(durationMinutes)} mins`,
        vehicleType,
        surgeType: surgeType !== 'normal' ? surgeType : null,
        surgeMultiplier: surgeMultiplier > 1 ? `${surgeMultiplier}x` : null
      },
      metadata: {
        calculatedAt: new Date().toISOString(),
        distanceMeters: distanceInMeters,
        durationSeconds: durationInSeconds
      }
    };
  }

  /**
   * Calculate fare estimate for booking preview
   * @param {Object} pickupCoords - {latitude, longitude}
   * @param {Object} destinationCoords - {latitude, longitude}
   * @param {string} vehicleType
   * @param {string} surgeType
   * @returns {Object} fare estimate
   */
  calculateFareEstimate(pickupCoords, destinationCoords, vehicleType = 'standard', surgeType = 'normal') {
    const DistanceCalculator = require('./distanceCalculator');

    const distanceData = DistanceCalculator.calculateDistance(pickupCoords, destinationCoords);

    return this.calculateFare(
      distanceData.distance,
      distanceData.duration,
      vehicleType,
      surgeType
    );
  }

  /**
   * Get fare ranges for different vehicle types
   * @param {Object} pickupCoords
   * @param {Object} destinationCoords
   * @returns {Object} fare ranges by vehicle type
   */
  getFareRanges(pickupCoords, destinationCoords) {
    const DistanceCalculator = require('./distanceCalculator');
    const distanceData = DistanceCalculator.calculateDistance(pickupCoords, destinationCoords);

    const ranges = {};

    Object.keys(this.baseFares).forEach(vehicleType => {
      const fare = this.calculateFare(distanceData.distance, distanceData.duration, vehicleType, 'normal');
      ranges[vehicleType] = {
        min: fare.totals.finalTotal,
        max: fare.totals.finalTotal, // For now, same min/max (could vary with surge)
        currency: fare.currency
      };
    });

    return ranges;
  }

  /**
   * Determine surge pricing based on demand and time
   * @param {Date} requestedTime
   * @param {number} demandMultiplier - Current demand level (0-1)
   * @returns {string} surge type
   */
  determineSurgeType(requestedTime, demandMultiplier = 0) {
    const hour = requestedTime.getHours();

    // Peak hours: 7-9 AM and 5-7 PM
    const isPeakHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);

    // High demand threshold
    const isHighDemand = demandMultiplier > 0.7;

    if (isHighDemand) {
      return 'high_demand';
    } else if (isPeakHour) {
      return 'peak';
    } else {
      return 'normal';
    }
  }
}

module.exports = new FareCalculator();