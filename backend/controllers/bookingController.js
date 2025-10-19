const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Driver = require('../models/Driver');

// Helper function for validation errors
function buildValidationError(res, errors) {
  return res.status(400).json({ errors: errors.array() });
}

// @desc    Create a new ride booking
// @route   POST /api/bookings/ride
// @access  Private (User)
const createRideBooking = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return buildValidationError(res, errors);
  }

  const { pickupLocation, destinationLocation } = req.body;

  const booking = await Booking.create({
    user: req.user.id,
    type: 'ride',
    pickupLocation,
    destinationLocation,
    status: 'pending',
  });

  const populatedBooking = await Booking.findById(booking._id)
    .populate('user', 'name email')
    .populate({
      path: 'driver',
      populate: {
        path: 'user',
        select: 'name email',
      },
    });

  res.status(201).json({
    success: true,
    data: populatedBooking,
    message: 'Ride booking created successfully',
  });
});

// @desc    Create a new delivery booking
// @route   POST /api/bookings/delivery
// @access  Private (User)
const createDeliveryBooking = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return buildValidationError(res, errors);
  }

  const { pickupLocation, destinationLocation, packageDetails } = req.body;

  const booking = await Booking.create({
    user: req.user.id,
    type: 'delivery',
    pickupLocation,
    destinationLocation,
    packageDetails,
    status: 'pending',
  });

  const populatedBooking = await Booking.findById(booking._id)
    .populate('user', 'name email')
    .populate({
      path: 'driver',
      populate: {
        path: 'user',
        select: 'name email',
      },
    });

  res.status(201).json({
    success: true,
    data: populatedBooking,
    message: 'Delivery booking created successfully',
  });
});

// @desc    Get user's bookings
// @route   GET /api/bookings
// @access  Private (User)
const getUserBookings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, type } = req.query;

  const query = { user: req.user.id };

  if (status) query.status = status;
  if (type) query.type = type;

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
    populate: [
      {
        path: 'driver',
        populate: {
          path: 'user',
          select: 'name email',
        },
      },
    ],
  };

  const bookings = await Booking.paginate(query, options);

  res.json({
    success: true,
    data: bookings.docs,
    pagination: {
      page: bookings.page,
      pages: bookings.totalPages,
      total: bookings.totalDocs,
      limit: bookings.limit,
    },
  });
});

// @desc    Get single booking details
// @route   GET /api/bookings/:id
// @access  Private (User)
const getBookingDetails = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('user', 'name email avatarUrl')
    .populate({
      path: 'driver',
      populate: {
        path: 'user',
        select: 'name email avatarUrl',
      },
    });

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  // Check if user owns this booking or is admin
  if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to view this booking' });
  }

  res.json({
    success: true,
    data: booking,
  });
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private (User)
const cancelBooking = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  // Check if user owns this booking
  if (booking.user.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to cancel this booking' });
  }

  // Check if booking can be cancelled
  if (['completed', 'cancelled', 'in_transit', 'picked_up'].includes(booking.status)) {
    return res.status(400).json({ message: 'Cannot cancel booking in current status' });
  }

  booking.status = 'cancelled';
  booking.cancelledAt = new Date();
  booking.cancellationReason = reason;
  booking.cancelledBy = 'user';

  await booking.save();

  res.json({
    success: true,
    data: booking,
    message: 'Booking cancelled successfully',
  });
});

// @desc    Confirm payment for completed booking
// @route   PUT /api/bookings/:id/confirm-payment
// @access  Private (User)
const confirmPayment = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  // Check if user owns this booking
  if (booking.user.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  // Check if booking is completed
  if (booking.status !== 'completed') {
    return res.status(400).json({ message: 'Booking must be completed to confirm payment' });
  }

  booking.payment.status = 'confirmed';
  booking.payment.confirmedAt = new Date();
  booking.payment.confirmedBy = 'user';

  await booking.save();

  res.json({
    success: true,
    data: booking,
    message: 'Payment confirmed successfully',
  });
});

// @desc    Get booking statistics for user
// @route   GET /api/bookings/stats
// @access  Private (User)
const getBookingStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const stats = await Booking.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        completedBookings: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
        },
        cancelledBookings: {
          $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] },
        },
        totalSpent: {
          $sum: {
            $cond: [
              { $eq: ['$status', 'completed'] },
              '$price.amount',
              0,
            ],
          },
        },
        rideBookings: {
          $sum: { $cond: [{ $eq: ['$type', 'ride'] }, 1, 0] },
        },
        deliveryBookings: {
          $sum: { $cond: [{ $eq: ['$type', 'delivery'] }, 1, 0] },
        },
      },
    },
  ]);

  const result = stats.length > 0 ? stats[0] : {
    totalBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalSpent: 0,
    rideBookings: 0,
    deliveryBookings: 0,
  };

  // Calculate completion rate
  result.completionRate = result.totalBookings > 0
    ? Math.round((result.completedBookings / result.totalBookings) * 100)
    : 0;

  res.json({
    success: true,
    data: result,
  });
});

// @desc    Assign driver to booking (Admin)
// @route   PUT /api/bookings/:id/assign-driver
// @access  Private (Admin)
const assignDriver = asyncHandler(async (req, res) => {
  const { driverId, price } = req.body;

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  // Check if booking can be assigned
  if (!['pending'].includes(booking.status)) {
    return res.status(400).json({ message: 'Booking cannot be assigned in current status' });
  }

  // Verify driver exists and is approved
  const Driver = require('../models/Driver');
  const driver = await Driver.findById(driverId);
  if (!driver) {
    return res.status(404).json({ message: 'Driver not found' });
  }

  if (driver.status !== 'approved') {
    return res.status(400).json({ message: 'Driver is not approved' });
  }

  if (!driver.isAvailable()) {
    return res.status(400).json({ message: 'Driver is not available' });
  }

  // Update booking
  booking.driver = driverId;
  booking.status = 'driver_assigned';
  booking.price = {
    amount: price.amount,
    currency: price.currency || 'GMD',
    setAt: new Date(),
    setBy: 'admin',
  };
  booking.driverAssignedAt = new Date();

  await booking.save();

  // Assign booking to driver
  await driver.assignBooking(booking._id);

  const populatedBooking = await Booking.findById(booking._id)
    .populate('user', 'name email')
    .populate({
      path: 'driver',
      populate: {
        path: 'user',
        select: 'name email',
      },
    });

  res.json({
    success: true,
    data: populatedBooking,
    message: 'Driver assigned successfully',
  });
});

// @desc    Get all bookings for admin management
// @route   GET /api/bookings/admin
// @access  Private (Admin)
const getAllBookings = asyncHandler(async (req, res) => {
  const {
    status,
    type,
    page = 1,
    limit = 10,
    search,
    dateFrom,
    dateTo,
  } = req.query;

  const query = {};

  if (status) query.status = status;
  if (type) query.type = type;

  // Date range filter
  if (dateFrom || dateTo) {
    query.createdAt = {};
    if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
    if (dateTo) query.createdAt.$lte = new Date(dateTo);
  }

  // Search by user name, email, or pickup location
  if (search) {
    query.$or = [
      { 'user.name': { $regex: search, $options: 'i' } },
      { 'user.email': { $regex: search, $options: 'i' } },
      { pickupLocation: { $regex: search, $options: 'i' } },
      { destinationLocation: { $regex: search, $options: 'i' } },
    ];
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
    populate: [
      {
        path: 'user',
        select: 'name email avatarUrl',
      },
      {
        path: 'driver',
        populate: {
          path: 'user',
          select: 'name email avatarUrl',
        },
      },
    ],
  };

  const bookings = await Booking.paginate(query, options);

  res.json({
    success: true,
    data: bookings.docs,
    pagination: {
      page: bookings.page,
      pages: bookings.totalPages,
      total: bookings.totalDocs,
      limit: bookings.limit,
    },
  });
});

// @desc    Get available drivers for assignment
// @route   GET /api/bookings/available-drivers
// @access  Private (Admin)
const getAvailableDrivers = asyncHandler(async (req, res) => {
  const { pickupLocation, type } = req.query;

  const Driver = require('../models/Driver');

  // Find approved and available drivers
  const query = {
    status: 'approved',
    availabilityStatus: 'available',
    currentBooking: { $exists: false },
  };

  // Filter by service areas if pickup location provided
  if (pickupLocation) {
    // Simple area matching - in production, use geospatial queries
    const commonAreas = ['Banjul', 'Serrekunda', 'Brikama', 'Bakau'];
    const matchedArea = commonAreas.find(area =>
      pickupLocation.toLowerCase().includes(area.toLowerCase())
    );
    if (matchedArea) {
      query.serviceAreas = matchedArea;
    }
  }

  // Filter by driver preferences (accepts rides/deliveries)
  if (type === 'ride') {
    query['preferences.acceptsRides'] = true;
  } else if (type === 'delivery') {
    query['preferences.acceptsDeliveries'] = true;
  }

  const drivers = await Driver.find(query)
    .populate('user', 'name email avatarUrl')
    .select('vehicle rating availabilityStatus serviceAreas currentLocation')
    .sort({ 'rating.average': -1 })
    .limit(20);

  res.json({
    success: true,
    data: drivers,
  });
});

module.exports = {
  createRideBooking,
  createDeliveryBooking,
  getUserBookings,
  getBookingDetails,
  cancelBooking,
  confirmPayment,
  getBookingStats,
  assignDriver,
  getAllBookings,
  getAvailableDrivers,
};
