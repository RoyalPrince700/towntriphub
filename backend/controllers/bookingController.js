const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Review = require('../models/Review');

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

  const { pickupLocation, destinationLocation, passengers, scheduledTime } = req.body;

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const booking = await Booking.create({
    user: req.user.id,
    type: 'ride',
    pickupLocation,
    destinationLocation,
    passengers: passengers || 1,
    scheduledTime,
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
    })
    .populate({
      path: 'logisticsPersonnel',
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
    })
    .populate({
      path: 'logisticsPersonnel',
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
    .populate('user', 'name email avatarUrl phoneNumber')
    .populate({
      path: 'driver',
      populate: {
        path: 'user',
        select: 'name email avatarUrl phoneNumber',
      },
    })
    .populate({
      path: 'logisticsPersonnel',
      populate: {
        path: 'user',
        select: 'name email avatarUrl phoneNumber',
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
// @access  Private (User/Driver/Admin)
const cancelBooking = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  // Check authorization: User owns it, or Driver is assigned to it, or Admin
  const isOwner = booking.user.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';
  
  let isAssignedDriver = false;
  if (req.user.role === 'driver') {
    const driver = await Driver.findOne({ user: req.user.id });
    if (driver && booking.driver && booking.driver.toString() === driver._id.toString()) {
      isAssignedDriver = true;
    }
  }

  if (!isOwner && !isAdmin && !isAssignedDriver) {
    return res.status(403).json({ message: 'Not authorized to cancel this booking' });
  }

  // Check if booking can be cancelled
  if (['completed', 'cancelled'].includes(booking.status)) {
    return res.status(400).json({ message: 'Booking is already completed or cancelled' });
  }

  // If driver cancels, check if they already started the trip (some systems prevent cancellation after pickup)
  if (isAssignedDriver && ['picked_up', 'in_transit'].includes(booking.status)) {
    return res.status(400).json({ message: 'Cannot cancel booking after pickup' });
  }

  const oldStatus = booking.status;
  booking.status = 'cancelled';
  booking.cancelledAt = new Date();
  booking.cancellationReason = reason;
  
  if (isOwner) {
    booking.cancelledBy = 'user';
  } else if (isAssignedDriver) {
    booking.cancelledBy = 'driver';
    // If driver cancels, we should also free up the driver
    const driver = await Driver.findOne({ user: req.user.id });
    if (driver) {
      await driver.completeBooking(); // This clears currentBooking and sets status to available
    }
  } else if (isAdmin) {
    booking.cancelledBy = 'admin';
    // If admin cancels and a driver was assigned, free up the driver
    if (booking.driver) {
      const assignedDriver = await Driver.findById(booking.driver);
      if (assignedDriver) {
        await assignedDriver.completeBooking();
      }
    }
  }

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

  // Get average rating for user
  const ratingData = await Review.getAverageRating(userId, 'driver_to_user');
  result.avgRating = ratingData.averageRating;
  result.totalReviews = ratingData.totalReviews;

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

  // Verify driver exists and is approved/active
  const Driver = require('../models/Driver');
  const driver = await Driver.findById(driverId);
  if (!driver) {
    return res.status(404).json({ message: 'Driver not found' });
  }

  if (!['approved', 'active'].includes(driver.status)) {
    return res.status(400).json({ message: 'Driver is not approved' });
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
    })
    .populate({
      path: 'logisticsPersonnel',
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
        select: 'name email avatarUrl phoneNumber',
      },
      {
        path: 'driver',
        populate: {
          path: 'user',
          select: 'name email avatarUrl phoneNumber',
        },
      },
      {
        path: 'logisticsPersonnel',
        populate: {
          path: 'user',
          select: 'name email avatarUrl phoneNumber',
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
  const { type } = req.query;

  const Driver = require('../models/Driver');

  // Find all approved drivers (including those on trips or busy, as per user request)
  const query = {
    status: { $in: ['approved', 'active'] },
  };

  const drivers = await Driver.find(query)
    .populate('user', 'name email avatarUrl')
    .select('vehicle rating availabilityStatus serviceAreas currentLocation')
    .sort({ 'rating.average': -1 })
    .limit(50); // Increased limit to show more drivers

  res.json({
    success: true,
    data: drivers,
  });
});

// @desc    Assign logistics personnel to booking (Admin)
// @route   PUT /api/bookings/:id/assign-logistics
// @access  Private (Admin)
const assignLogisticsPersonnel = asyncHandler(async (req, res) => {
  const { personnelId, price } = req.body;

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  // Check if booking can be assigned
  if (!['pending'].includes(booking.status)) {
    return res.status(400).json({ message: 'Booking cannot be assigned in current status' });
  }

  // Verify logistics personnel exists and is approved/active
  const LogisticsPersonnel = require('../models/LogisticsPersonnel');
  const personnel = await LogisticsPersonnel.findById(personnelId);
  if (!personnel) {
    return res.status(404).json({ message: 'Logistics personnel not found' });
  }

  if (!['approved', 'active'].includes(personnel.status)) {
    return res.status(400).json({ message: 'Logistics personnel is not approved' });
  }

  // Update booking
  booking.logisticsPersonnel = personnelId;
  booking.status = 'driver_assigned'; // We can keep same status or add 'personnel_assigned'
  booking.price = {
    amount: price.amount,
    currency: price.currency || 'GMD',
    setAt: new Date(),
    setBy: 'admin',
  };
  booking.driverAssignedAt = new Date();

  await booking.save();

  // Assign booking to personnel
  personnel.currentBooking = booking._id;
  personnel.availabilityStatus = 'on_delivery';
  await personnel.save();

  const populatedBooking = await Booking.findById(booking._id)
    .populate('user', 'name email')
    .populate({
      path: 'logisticsPersonnel',
      populate: {
        path: 'user',
        select: 'name email',
      },
    });

  res.json({
    success: true,
    data: populatedBooking,
    message: 'Logistics personnel assigned successfully',
  });
});

// @desc    Get available logistics personnel for assignment
// @route   GET /api/bookings/available-logistics
// @access  Private (Admin)
const getAvailableLogisticsPersonnel = asyncHandler(async (req, res) => {
  const LogisticsPersonnel = require('../models/LogisticsPersonnel');

  // Find all approved logistics personnel
  const query = {
    status: { $in: ['approved', 'active'] },
  };

  const personnel = await LogisticsPersonnel.find(query)
    .populate('user', 'name email avatarUrl')
    .select('businessName businessType rating availabilityStatus serviceAreas businessAddress services')
    .sort({ 'rating.average': -1 })
    .limit(50);

  res.json({
    success: true,
    data: personnel,
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
  assignLogisticsPersonnel,
  getAllBookings,
  getAvailableDrivers,
  getAvailableLogisticsPersonnel,
};
