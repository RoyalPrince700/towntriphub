/**
 * Client-side Fare Calculator Utility
 * Mirrors backend logic for instant calculations
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

    // Price per minute in GMD
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
      peak: 1.5,
      high_demand: 2.0,
      emergency: 3.0
    };
  }

  /**
   * Calculate fare using Haversine distance
   * @param {Object} pickupCoords - {latitude, longitude}
   * @param {Object} destinationCoords - {latitude, longitude}
   * @param {string} vehicleType
   * @param {string} surgeType
   * @returns {Object} fare breakdown
   */
  calculateFare(pickupCoords, destinationCoords, vehicleType = 'standard', surgeType = 'normal') {
    const distance = this.calculateHaversineDistance(pickupCoords, destinationCoords);
    const estimatedDuration = this.estimateDuration(distance, surgeType);

    return this.calculateFareFromDistance(distance, estimatedDuration, vehicleType, surgeType);
  }

  /**
   * Calculate Haversine distance between two points
   * @param {Object} point1 - {latitude, longitude}
   * @param {Object} point2 - {latitude, longitude}
   * @returns {number} distance in meters
   */
  calculateHaversineDistance(point1, point2) {
    const R = 6371000; // Earth's radius in meters

    const lat1Rad = this.toRadians(point1.latitude);
    const lat2Rad = this.toRadians(point2.latitude);
    const deltaLatRad = this.toRadians(point2.latitude - point1.latitude);
    const deltaLngRad = this.toRadians(point2.longitude - point1.longitude);

    const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(deltaLngRad / 2) * Math.sin(deltaLngRad / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  /**
   * Estimate trip duration based on distance and traffic
   * @param {number} distanceInMeters
   * @param {string} timeOfDay
   * @returns {number} duration in seconds
   */
  estimateDuration(distanceInMeters, timeOfDay = 'normal') {
    const baseSpeedKmh = 30; // Base speed in km/h

    const speedMultipliers = {
      'normal': 1.0,
      'peak': 0.6,
      'high_demand': 0.7,
      'emergency': 0.5
    };

    const adjustedSpeed = baseSpeedKmh * speedMultipliers[timeOfDay];
    const durationHours = (distanceInMeters / 1000) / adjustedSpeed;

    return Math.round(durationHours * 3600); // Convert to seconds
  }

  /**
   * Calculate fare from distance and duration
   * @param {number} distanceInMeters
   * @param {number} durationInSeconds
   * @param {string} vehicleType
   * @param {string} surgeType
   * @returns {Object} fare breakdown
   */
  calculateFareFromDistance(distanceInMeters, durationInSeconds, vehicleType = 'standard', surgeType = 'normal') {
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
   * Convert degrees to radians
   * @param {number} degrees
   * @returns {number} radians
   */
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Get fare ranges for different vehicle types
   * @param {Object} pickupCoords
   * @param {Object} destinationCoords
   * @returns {Object} fare ranges
   */
  getFareRanges(pickupCoords, destinationCoords) {
    const distance = this.calculateHaversineDistance(pickupCoords, destinationCoords);
    const estimatedDuration = this.estimateDuration(distance, 'normal');

    const ranges = {};

    Object.keys(this.baseFares).forEach(vehicleType => {
      const fare = this.calculateFareFromDistance(distance, estimatedDuration, vehicleType, 'normal');
      ranges[vehicleType] = {
        min: fare.totals.finalTotal,
        max: fare.totals.finalTotal,
        currency: fare.currency
      };
    });

    return ranges;
  }

  /**
   * Format currency amount
   * @param {number} amount
   * @param {string} currency
   * @returns {string} formatted amount
   */
  formatCurrency(amount, currency = 'GMD') {
    return `${amount} ${currency}`;
  }
}

export default new FareCalculator();