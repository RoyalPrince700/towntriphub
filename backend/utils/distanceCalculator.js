/**
 * Distance Calculator using Haversine formula
 * Calculates distance between two coordinates on Earth
 */

class DistanceCalculator {
  /**
   * Calculate distance between two points using Haversine formula
   * @param {Object} point1 - {latitude, longitude}
   * @param {Object} point2 - {latitude, longitude}
   * @returns {Object} - {distance: number (meters), duration: number (seconds)}
   */
  static calculateDistance(point1, point2) {
    const R = 6371000; // Earth's radius in meters

    const lat1Rad = this.toRadians(point1.latitude);
    const lat2Rad = this.toRadians(point2.latitude);
    const deltaLatRad = this.toRadians(point2.latitude - point1.latitude);
    const deltaLngRad = this.toRadians(point2.longitude - point1.longitude);

    const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(deltaLngRad / 2) * Math.sin(deltaLngRad / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in meters

    // Estimate duration (assuming average speed of 30 km/h in urban areas)
    const averageSpeedKmh = 30;
    const duration = (distance / 1000) / averageSpeedKmh * 3600; // Duration in seconds

    return {
      distance: Math.round(distance),
      duration: Math.round(duration),
      distanceText: `${(distance / 1000).toFixed(1)} km`,
      durationText: `${Math.round(duration / 60)} mins`
    };
  }

  /**
   * Convert degrees to radians
   * @param {number} degrees
   * @returns {number} radians
   */
  static toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Calculate estimated duration based on distance and traffic conditions
   * @param {number} distanceInMeters
   * @param {string} timeOfDay - 'peak', 'off-peak', 'normal'
   * @returns {number} estimated duration in seconds
   */
  static calculateEstimatedDuration(distanceInMeters, timeOfDay = 'normal') {
    const baseSpeedKmh = 30; // Base speed in km/h

    // Adjust speed based on time of day (traffic conditions)
    const speedMultipliers = {
      'peak': 0.6,      // 60% of base speed during peak hours
      'off-peak': 1.2,  // 120% of base speed during off-peak
      'normal': 1.0     // Normal speed
    };

    const adjustedSpeed = baseSpeedKmh * speedMultipliers[timeOfDay];
    const durationHours = (distanceInMeters / 1000) / adjustedSpeed;

    return Math.round(durationHours * 3600); // Convert to seconds
  }
}

module.exports = DistanceCalculator;