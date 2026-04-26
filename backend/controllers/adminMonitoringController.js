const Booking = require('../models/Booking');
const socketService = require('../services/socketService');
const asyncHandler = require('express-async-handler');

// Get all active trips
const getActiveTrips = asyncHandler(async (req, res) => {
  const activeTrips = await Booking.find({
    status: {
      $in: ['driver_assigned', 'driver_en_route', 'picked_up', 'in_transit']
    }
  })
    .populate('user', 'name phoneNumber')
    .populate({ path: 'driver', select: 'phoneNumber vehicle user', populate: { path: 'user', select: 'name phoneNumber' } })
    .sort({ createdAt: -1 });

  // Get real-time driver locations
  const driverLocations = socketService.getActiveDrivers();

  // Combine trip data with real-time locations
  const tripsWithLocations = activeTrips.map(trip => {
    const driverId = trip.driver?._id?.toString();
    const driverLocation = driverId
      ? driverLocations.find(loc => String(loc.driverId) === String(driverId))
      : null;

    return {
      ...trip.toObject(),
      driverLocation: driverLocation || null
    };
  });

  res.json({
    success: true,
    data: tripsWithLocations
  });
});

// Get trip statistics
const getTripStatistics = asyncHandler(async (req, res) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    totalActiveTrips,
    totalTripsToday,
    totalCompletedToday,
    totalCancelledToday
  ] = await Promise.all([
    Booking.countDocuments({
      status: { $in: ['driver_assigned', 'driver_en_route', 'picked_up', 'in_transit'] }
    }),
    Booking.countDocuments({ createdAt: { $gte: today } }),
    Booking.countDocuments({
      status: 'completed',
      completedAt: { $gte: today }
    }),
    Booking.countDocuments({
      status: 'cancelled',
      cancelledAt: { $gte: today }
    })
  ]);

  res.json({
    success: true,
    data: {
      activeTrips: totalActiveTrips,
      totalTripsToday,
      completedToday: totalCompletedToday,
      cancelledToday: totalCancelledToday,
      completionRate: totalTripsToday > 0 ? (totalCompletedToday / totalTripsToday * 100).toFixed(1) : 0
    }
  });
});

module.exports = {
  getActiveTrips,
  getTripStatistics
};
