const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const { cloudinary } = require('../config/cloudinary');
const fs = require('fs');
const Driver = require('../models/Driver');
const User = require('../models/User');
const Booking = require('../models/Booking');

// Helper function for validation errors
function buildValidationError(res, errors) {
  return res.status(400).json({ errors: errors.array() });
}

// @desc    Register as a driver
// @route   POST /api/drivers/register
// @access  Private (User)
const registerDriver = asyncHandler(async (req, res) => {
  console.log('=== DRIVER REGISTRATION BACKEND ===');
  console.log('User ID:', req.user?.id);
  
  // Parse JSON fields if they are strings (when coming from FormData)
  if (typeof req.body.vehicle === 'string') {
    try {
      req.body.vehicle = JSON.parse(req.body.vehicle);
    } catch (e) {}
  }
  if (typeof req.body.preferences === 'string') {
    try {
      req.body.preferences = JSON.parse(req.body.preferences);
    } catch (e) {}
  }
  if (typeof req.body.serviceAreas === 'string') {
    try {
      req.body.serviceAreas = JSON.parse(req.body.serviceAreas);
    } catch (e) {}
  }
  if (typeof req.body.emergencyContact === 'string') {
    try {
      req.body.emergencyContact = JSON.parse(req.body.emergencyContact);
    } catch (e) {}
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Validation Errors:', JSON.stringify(errors.array(), null, 2));
    return buildValidationError(res, errors);
  }

  const {
    dateOfBirth,
    licenseNumber,
    licenseExpiryDate,
    phoneNumber,
    emergencyContact,
    vehicle,
    serviceAreas,
    preferences,
  } = req.body;

  // Check if user is already a driver
  const existingDriver = await Driver.findOne({ user: req.user.id });
  if (existingDriver) {
    console.log('User already registered as driver');
    return res.status(400).json({ message: 'User is already registered as a driver' });
  }

  // Check if license number is already taken
  const existingLicense = await Driver.findOne({ licenseNumber: licenseNumber.toUpperCase() });
  if (existingLicense) {
    console.log('License number already exists');
    return res.status(400).json({ message: 'License number is already registered' });
  }

  // Check if vehicle plate number is already taken
  const existingPlate = await Driver.findOne({ 'vehicle.plateNumber': vehicle.plateNumber.toUpperCase() });
  if (existingPlate) {
    console.log('Plate number already exists');
    return res.status(400).json({ message: 'Vehicle plate number is already registered' });
  }

  // Handle file uploads
  const documents = {};
  if (req.files) {
    const uploadToCloudinary = async (file, type) => {
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'towntriphub/documents',
        public_id: `driver_${req.user.id}_${type}_${Date.now()}`,
      });
      if (fs.existsSync(file.tempFilePath)) {
        fs.unlinkSync(file.tempFilePath);
      }
      return result.secure_url;
    };

    if (req.files.vehicleFrontPhoto) {
      documents.vehicleFrontPhoto = await uploadToCloudinary(req.files.vehicleFrontPhoto, 'vehicle_front');
    }
    if (req.files.vehicleSidePhoto) {
      documents.vehicleSidePhoto = await uploadToCloudinary(req.files.vehicleSidePhoto, 'vehicle_side');
    }
    if (req.files.vehicleBackPhoto) {
      documents.vehicleBackPhoto = await uploadToCloudinary(req.files.vehicleBackPhoto, 'vehicle_back');
    }
  }

  // Create driver profile
  console.log('Creating driver profile...');
  const driver = await Driver.create({
    user: req.user.id,
    dateOfBirth,
    licenseNumber: licenseNumber.toUpperCase(),
    licenseExpiryDate,
    phoneNumber,
    emergencyContact,
    vehicle: {
      ...vehicle,
      year: parseInt(vehicle.year, 10),
      seatingCapacity: parseInt(vehicle.seatingCapacity, 10),
      plateNumber: vehicle.plateNumber.toUpperCase(),
      registrationNumber: vehicle.registrationNumber.toUpperCase(),
    },
    serviceAreas: serviceAreas || [],
    preferences: preferences || {},
    documents,
    status: 'pending_approval',
  });

  console.log('Driver created successfully:', driver._id);
  const populatedDriver = await Driver.findById(driver._id)
    .populate('user', 'name email')
    .select('-__v');

  res.status(201).json({
    success: true,
    data: populatedDriver,
    message: 'Driver registration submitted successfully. Please wait for admin approval.',
  });
});

// @desc    Get driver profile
// @route   GET /api/drivers/profile
// @access  Private (Driver)
const getDriverProfile = asyncHandler(async (req, res) => {
  const driver = await Driver.findOne({ user: req.user.id })
    .populate('user', 'name email avatarUrl')
    .select('-__v');

  if (!driver) {
    return res.status(404).json({ message: 'Driver profile not found' });
  }

  res.json({
    success: true,
    data: driver,
  });
});

// @desc    Update driver profile
// @route   PUT /api/drivers/profile
// @access  Private (Driver)
const updateDriverProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return buildValidationError(res, errors);
  }

  const driver = await Driver.findOne({ user: req.user.id });
  if (!driver) {
    return res.status(404).json({ message: 'Driver profile not found' });
  }

  const {
    phoneNumber,
    emergencyContact,
    serviceAreas,
    preferences,
    currentLocation,
  } = req.body;

  // Update allowed fields
  if (phoneNumber) driver.phoneNumber = phoneNumber;
  if (emergencyContact) driver.emergencyContact = { ...driver.emergencyContact, ...emergencyContact };
  if (serviceAreas) driver.serviceAreas = serviceAreas;
  if (preferences) driver.preferences = { ...driver.preferences, ...preferences };
  if (currentLocation) {
    driver.currentLocation = {
      ...driver.currentLocation,
      ...currentLocation,
      lastUpdated: new Date(),
    };
  }

  await driver.save();

  const updatedDriver = await Driver.findById(driver._id)
    .populate('user', 'name email avatarUrl')
    .select('-__v');

  res.json({
    success: true,
    data: updatedDriver,
    message: 'Driver profile updated successfully',
  });
});

// @desc    Update driver availability status
// @route   PUT /api/drivers/availability
// @access  Private (Driver)
const updateAvailabilityStatus = asyncHandler(async (req, res) => {
  const { availabilityStatus } = req.body;

  const validStatuses = ['offline', 'available', 'busy'];
  if (!validStatuses.includes(availabilityStatus)) {
    return res.status(400).json({ message: 'Invalid availability status' });
  }

  const driver = await Driver.findOne({ user: req.user.id });
  if (!driver) {
    return res.status(404).json({ message: 'Driver profile not found' });
  }

  // Don't allow status change to available if driver has active booking
  if (availabilityStatus === 'available' && driver.currentBooking) {
    return res.status(400).json({ message: 'Cannot set status to available while having an active booking' });
  }

  driver.availabilityStatus = availabilityStatus;
  await driver.save();

  res.json({
    success: true,
    data: { availabilityStatus: driver.availabilityStatus },
    message: 'Availability status updated successfully',
  });
});

// @desc    Update vehicle information
// @route   PUT /api/drivers/vehicle
// @access  Private (Driver)
const updateVehicleInfo = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return buildValidationError(res, errors);
  }

  const driver = await Driver.findOne({ user: req.user.id });
  if (!driver) {
    return res.status(404).json({ message: 'Driver profile not found' });
  }

  const {
    make,
    model,
    year,
    color,
    vehicleType,
    seatingCapacity,
    hasAC,
    registrationExpiry,
    insuranceExpiry,
  } = req.body;

  // Check if new plate number is already taken (if changing)
  if (req.body.plateNumber && req.body.plateNumber.toUpperCase() !== driver.vehicle.plateNumber) {
    const existingPlate = await Driver.findOne({ 'vehicle.plateNumber': req.body.plateNumber.toUpperCase() });
    if (existingPlate) {
      return res.status(400).json({ message: 'Vehicle plate number is already registered' });
    }
    driver.vehicle.plateNumber = req.body.plateNumber.toUpperCase();
  }

  // Update vehicle fields
  if (make) driver.vehicle.make = make;
  if (model) driver.vehicle.model = model;
  if (year) driver.vehicle.year = year;
  if (color) driver.vehicle.color = color;
  if (vehicleType) driver.vehicle.vehicleType = vehicleType;
  if (seatingCapacity) driver.vehicle.seatingCapacity = seatingCapacity;
  if (hasAC !== undefined) driver.vehicle.hasAC = hasAC;
  if (registrationExpiry) driver.vehicle.registrationExpiry = registrationExpiry;
  if (insuranceExpiry) driver.vehicle.insuranceExpiry = insuranceExpiry;

  // Set status to pending approval if vehicle info changed significantly
  if (make || model || year || vehicleType) {
    driver.status = 'pending_approval';
  }

  await driver.save();

  res.json({
    success: true,
    data: driver.vehicle,
    message: 'Vehicle information updated successfully',
  });
});

// @desc    Get driver's current bookings/assignments
// @route   GET /api/drivers/assignments
// @access  Private (Driver)
const getDriverAssignments = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  const driver = await Driver.findOne({ user: req.user.id });
  if (!driver) {
    return res.status(404).json({ message: 'Driver profile not found' });
  }

  const query = { driver: driver._id };

  if (status) {
    // If multiple statuses are provided (comma-separated), use $in
    if (status.includes(',')) {
      query.status = { $in: status.split(',') };
    } else {
      query.status = status;
    }
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

// @desc    Update trip status
// @route   PUT /api/drivers/assignments/:bookingId/status
// @access  Private (Driver)
const updateTripStatus = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { status, location } = req.body;

  const validStatuses = ['driver_en_route', 'picked_up', 'in_transit', 'completed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid trip status' });
  }

  const driver = await Driver.findOne({ user: req.user.id });
  if (!driver) {
    return res.status(404).json({ message: 'Driver profile not found' });
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  // Check if booking is assigned to this driver
  if (booking.driver.toString() !== driver._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to update this booking' });
  }

  // Validate status transitions
  const currentStatus = booking.status;
  const allowedTransitions = {
    'driver_assigned': ['driver_en_route'],
    'driver_en_route': ['picked_up'],
    'picked_up': ['in_transit'],
    'in_transit': ['completed'],
  };

  if (!allowedTransitions[currentStatus] || !allowedTransitions[currentStatus].includes(status)) {
    return res.status(400).json({
      message: `Cannot change status from ${currentStatus} to ${status}`
    });
  }

  // Update booking status
  booking.status = status;

  // Set timestamps based on status
  const now = new Date();
  switch (status) {
    case 'driver_en_route':
      booking.driverEnRouteAt = now;
      break;
    case 'picked_up':
      booking.pickedUpAt = now;
      break;
    case 'completed':
      booking.completedAt = now;
      driver.completeBooking(); // Clear current booking and set availability
      break;
  }

  // Update location if provided
  if (location && driver.currentLocation) {
    driver.currentLocation.coordinates = location.coordinates || driver.currentLocation.coordinates;
    driver.currentLocation.address = location.address || driver.currentLocation.address;
    driver.currentLocation.lastUpdated = now;
    await driver.save();
  }

  await booking.save();

  // Update driver statistics for completed trips
  if (status === 'completed') {
    driver.updateStatistics(booking);
  }

  res.json({
    success: true,
    data: booking,
    message: 'Trip status updated successfully',
  });
});

// @desc    Get driver statistics and earnings
// @route   GET /api/drivers/statistics
// @access  Private (Driver)
const getDriverStatistics = asyncHandler(async (req, res) => {
  const driver = await Driver.findOne({ user: req.user.id });
  if (!driver) {
    return res.status(404).json({ message: 'Driver profile not found' });
  }

  // Get additional stats from bookings
  const bookingStats = await Booking.aggregate([
    { $match: { driver: driver._id } },
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
        totalEarnings: {
          $sum: {
            $cond: [
              { $eq: ['$status', 'completed'] },
              '$price.amount',
              0,
            ],
          },
        },
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  const stats = bookingStats.length > 0 ? bookingStats[0] : {
    totalBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalEarnings: 0,
    averageRating: 0,
  };

  // Calculate completion rate
  stats.completionRate = stats.totalBookings > 0
    ? Math.round((stats.completedBookings / stats.totalBookings) * 100)
    : 0;

  // Combine with driver stats
  const combinedStats = {
    ...stats,
    ...driver.statistics,
    earnings: driver.earnings,
    rating: driver.rating,
  };

  res.json({
    success: true,
    data: combinedStats,
  });
});

// @desc    Get driver's earnings summary
// @route   GET /api/drivers/earnings
// @access  Private (Driver)
const getDriverEarnings = asyncHandler(async (req, res) => {
  const driver = await Driver.findOne({ user: req.user.id });
  if (!driver) {
    return res.status(404).json({ message: 'Driver profile not found' });
  }

  // Get earnings breakdown by period
  const earningsBreakdown = await Booking.aggregate([
    { $match: { driver: driver._id, status: 'completed' } },
    {
      $group: {
        _id: {
          year: { $year: '$completedAt' },
          month: { $month: '$completedAt' },
        },
        totalEarnings: { $sum: '$price.amount' },
        tripCount: { $sum: 1 },
        averageTrip: { $avg: '$price.amount' },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 }, // Last 12 months
  ]);

  res.json({
    success: true,
    data: {
      summary: driver.earnings,
      breakdown: earningsBreakdown,
    },
  });
});

// Admin functions

// @desc    Get all drivers (Admin)
// @route   GET /api/drivers
// @access  Private (Admin)
const getAllDrivers = asyncHandler(async (req, res) => {
  const {
    status,
    availabilityStatus,
    page = 1,
    limit = 10,
    search,
  } = req.query;

  const query = {};

  if (status) query.status = status;
  if (availabilityStatus) query.availabilityStatus = availabilityStatus;
  if (search) {
    query.$or = [
      { 'user.name': { $regex: search, $options: 'i' } },
      { 'user.email': { $regex: search, $options: 'i' } },
      { 'vehicle.plateNumber': { $regex: search, $options: 'i' } },
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
        path: 'approvedBy',
        select: 'name email',
      },
    ],
  };

  const drivers = await Driver.paginate(query, options);

  res.json({
    success: true,
    data: drivers.docs,
    pagination: {
      page: drivers.page,
      pages: drivers.totalPages,
      total: drivers.totalDocs,
      limit: drivers.limit,
    },
  });
});

// @desc    Approve or reject driver (Admin)
// @route   PUT /api/drivers/:driverId/approval
// @access  Private (Admin)
const updateDriverApproval = asyncHandler(async (req, res) => {
  const { driverId } = req.params;
  const { action, reason } = req.body; // action: 'approve' or 'reject'

  const driver = await Driver.findById(driverId);
  if (!driver) {
    return res.status(404).json({ message: 'Driver not found' });
  }

  if (action === 'approve') {
    driver.status = 'approved';
    driver.approvedBy = req.user.id;
    driver.approvedAt = new Date();
    driver.availabilityStatus = 'offline'; // Start as offline, driver can change later

    // Update user's role to 'driver' when approved
    await User.findByIdAndUpdate(driver.user, { role: 'driver' });
  } else if (action === 'reject') {
    driver.status = 'rejected';
    driver.rejectionReason = reason;

    // Optional: Reset user's role to 'user' if rejected
    await User.findByIdAndUpdate(driver.user, { role: 'user' });
  } else {
    return res.status(400).json({ message: 'Invalid action' });
  }

  await driver.save();

  res.json({
    success: true,
    data: driver,
    message: `Driver ${action}d successfully`,
  });
});

// @desc    Suspend or reactivate driver (Admin)
// @route   PUT /api/drivers/:driverId/suspension
// @access  Private (Admin)
const updateDriverSuspension = asyncHandler(async (req, res) => {
  const { driverId } = req.params;
  const { action, reason } = req.body; // action: 'suspend' or 'reactivate'

  const driver = await Driver.findById(driverId);
  if (!driver) {
    return res.status(404).json({ message: 'Driver not found' });
  }

  if (action === 'suspend') {
    driver.status = 'suspended';
    driver.suspendedAt = new Date();
    driver.suspensionReason = reason;
    driver.availabilityStatus = 'offline';
    // Keep role as 'driver' even when suspended - they can still access driver features
  } else if (action === 'reactivate') {
    driver.status = 'approved';
    driver.suspendedAt = null;
    driver.suspensionReason = null;
    // Keep role as 'driver' - already set during approval
  } else {
    return res.status(400).json({ message: 'Invalid action' });
  }

  await driver.save();

  res.json({
    success: true,
    data: driver,
    message: `Driver ${action}d successfully`,
  });
});

module.exports = {
  registerDriver,
  getDriverProfile,
  updateDriverProfile,
  updateAvailabilityStatus,
  updateVehicleInfo,
  getDriverAssignments,
  updateTripStatus,
  getDriverStatistics,
  getDriverEarnings,
  getAllDrivers,
  updateDriverApproval,
  updateDriverSuspension,
};
