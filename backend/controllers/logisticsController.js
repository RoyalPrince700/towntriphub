const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const LogisticsPersonnel = require('../models/LogisticsPersonnel');
const User = require('../models/User');
const Booking = require('../models/Booking');

// Helper function for validation errors
function buildValidationError(res, errors) {
  return res.status(400).json({ errors: errors.array() });
}

// @desc    Register as logistics personnel
// @route   POST /api/logistics/register
// @access  Private (User)
const registerLogisticsPersonnel = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return buildValidationError(res, errors);
  }

  const {
    dispatchName,
    dateOfBirth,
    phoneNumber,
    emergencyContact,
    businessName,
    businessAddress,
    serviceAreas,
  } = req.body;

  // Check if user is already registered as logistics personnel
  const existingPersonnel = await LogisticsPersonnel.findOne({ user: req.user.id });
  if (existingPersonnel) {
    return res.status(400).json({ message: 'User is already registered as logistics personnel' });
  }

  // Handle file uploads
  let documents = {};
  if (req.files) {
    if (req.files.passportPhoto) {
      documents.profilePhoto = req.files.passportPhoto.tempFilePath;
    }
    if (req.files.idCard) {
      documents.businessLicense = req.files.idCard.tempFilePath; // Using businessLicense field for ID card
    }
    if (req.files.driverLicense) {
      documents.vehicleRegistration = req.files.driverLicense.tempFilePath; // Using vehicleRegistration field for driver license
    }
  }

  // Create logistics personnel profile with simplified fields
  const personnel = await LogisticsPersonnel.create({
    user: req.user.id,
    dateOfBirth,
    phoneNumber,
    emergencyContact,
    businessName: businessName || dispatchName, // Use dispatchName as businessName if businessName not provided
    businessType: 'individual',
    serviceAreas: serviceAreas || [],
    services: ['local_delivery'], // Default service
    businessAddress,
    operatingHours: {
      start: '08:00',
      end: '18:00',
    },
    operatingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    hasVehicles: true,
    fleetSize: 1,
    vehicleTypes: ['car'],
    maxPackageWeight: 50,
    maxPackageSize: {
      length: 100,
      width: 50,
      height: 50,
    },
    documents,
    status: 'pending_approval',
  });

  const populatedPersonnel = await LogisticsPersonnel.findById(personnel._id)
    .populate('user', 'name email')
    .select('-__v');

  res.status(201).json({
    success: true,
    data: populatedPersonnel,
    message: 'Logistics personnel registration submitted successfully. Please wait for admin approval.',
  });
});

// @desc    Get logistics personnel profile
// @route   GET /api/logistics/profile
// @access  Private (Logistics Personnel)
const getLogisticsProfile = asyncHandler(async (req, res) => {
  const personnel = await LogisticsPersonnel.findOne({ user: req.user.id })
    .populate('user', 'name email avatarUrl')
    .select('-__v');

  if (!personnel) {
    return res.status(404).json({ message: 'Logistics personnel profile not found' });
  }

  res.json({
    success: true,
    data: personnel,
  });
});

// @desc    Update logistics personnel profile
// @route   PUT /api/logistics/profile
// @access  Private (Logistics Personnel)
const updateLogisticsProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return buildValidationError(res, errors);
  }

  const personnel = await LogisticsPersonnel.findOne({ user: req.user.id });
  if (!personnel) {
    return res.status(404).json({ message: 'Logistics personnel profile not found' });
  }

  const {
    phoneNumber,
    emergencyContact,
    serviceAreas,
    services,
    businessAddress,
    operatingHours,
    operatingDays,
    preferences,
    maxPackageWeight,
    maxPackageSize,
    specialCapabilities,
  } = req.body;

  // Update allowed fields
  if (phoneNumber) personnel.phoneNumber = phoneNumber;
  if (emergencyContact) personnel.emergencyContact = { ...personnel.emergencyContact, ...emergencyContact };
  if (serviceAreas) personnel.serviceAreas = serviceAreas;
  if (services) personnel.services = services;
  if (businessAddress) personnel.businessAddress = { ...personnel.businessAddress, ...businessAddress };
  if (operatingHours) personnel.operatingHours = operatingHours;
  if (operatingDays) personnel.operatingDays = operatingDays;
  if (preferences) personnel.preferences = { ...personnel.preferences, ...preferences };
  if (maxPackageWeight) personnel.maxPackageWeight = maxPackageWeight;
  if (maxPackageSize) personnel.maxPackageSize = maxPackageSize;
  if (specialCapabilities) personnel.specialCapabilities = specialCapabilities;

  await personnel.save();

  const updatedPersonnel = await LogisticsPersonnel.findById(personnel._id)
    .populate('user', 'name email avatarUrl')
    .select('-__v');

  res.json({
    success: true,
    data: updatedPersonnel,
    message: 'Profile updated successfully',
  });
});

// @desc    Update availability status
// @route   PUT /api/logistics/availability
// @access  Private (Logistics Personnel)
const updateAvailabilityStatus = asyncHandler(async (req, res) => {
  const { availabilityStatus } = req.body;

  const validStatuses = ['offline', 'available', 'busy'];
  if (!validStatuses.includes(availabilityStatus)) {
    return res.status(400).json({ message: 'Invalid availability status' });
  }

  const personnel = await LogisticsPersonnel.findOne({ user: req.user.id });
  if (!personnel) {
    return res.status(404).json({ message: 'Logistics personnel profile not found' });
  }

  // Don't allow status change to available if personnel has active booking
  if (availabilityStatus === 'available' && personnel.currentBooking) {
    return res.status(400).json({ message: 'Cannot set status to available while having an active delivery' });
  }

  personnel.availabilityStatus = availabilityStatus;
  await personnel.save();

  res.json({
    success: true,
    data: { availabilityStatus: personnel.availabilityStatus },
    message: 'Availability status updated successfully',
  });
});

// @desc    Get current assignments
// @route   GET /api/logistics/assignments
// @access  Private (Logistics Personnel)
const getAssignments = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  const personnel = await LogisticsPersonnel.findOne({ user: req.user.id });
  if (!personnel) {
    return res.status(404).json({ message: 'Logistics personnel profile not found' });
  }

  const query = { driver: personnel._id };

  if (status) {
    query.status = status;
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

// @desc    Update delivery status
// @route   PUT /api/logistics/assignments/:bookingId/status
// @access  Private (Logistics Personnel)
const updateDeliveryStatus = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { status, location } = req.body;

  const validStatuses = ['driver_en_route', 'picked_up', 'in_transit', 'completed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid delivery status' });
  }

  const personnel = await LogisticsPersonnel.findOne({ user: req.user.id });
  if (!personnel) {
    return res.status(404).json({ message: 'Logistics personnel profile not found' });
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  // Check if booking is assigned to this logistics personnel
  if (booking.driver.toString() !== personnel._id.toString()) {
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
      personnel.completeBooking(); // Clear current booking and set availability
      break;
  }

  await booking.save();

  // Update statistics for completed deliveries
  if (status === 'completed') {
    personnel.updateStatistics(booking);
  }

  res.json({
    success: true,
    data: booking,
    message: 'Delivery status updated successfully',
  });
});

// @desc    Get statistics and earnings
// @route   GET /api/logistics/statistics
// @access  Private (Logistics Personnel)
const getStatistics = asyncHandler(async (req, res) => {
  const personnel = await LogisticsPersonnel.findOne({ user: req.user.id });
  if (!personnel) {
    return res.status(404).json({ message: 'Logistics personnel profile not found' });
  }

  // Get additional stats from bookings
  const bookingStats = await Booking.aggregate([
    { $match: { driver: personnel._id } },
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

  // Combine with personnel stats
  const combinedStats = {
    ...stats,
    ...personnel.statistics,
    earnings: personnel.earnings,
    rating: personnel.rating,
  };

  res.json({
    success: true,
    data: combinedStats,
  });
});

// @desc    Get earnings summary
// @route   GET /api/logistics/earnings
// @access  Private (Logistics Personnel)
const getEarnings = asyncHandler(async (req, res) => {
  const personnel = await LogisticsPersonnel.findOne({ user: req.user.id });
  if (!personnel) {
    return res.status(404).json({ message: 'Logistics personnel profile not found' });
  }

  // Get earnings breakdown by period
  const earningsBreakdown = await Booking.aggregate([
    { $match: { driver: personnel._id, status: 'completed' } },
    {
      $group: {
        _id: {
          year: { $year: '$completedAt' },
          month: { $month: '$completedAt' },
        },
        totalEarnings: { $sum: '$price.amount' },
        deliveryCount: { $sum: 1 },
        averageDelivery: { $avg: '$price.amount' },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 }, // Last 12 months
  ]);

  res.json({
    success: true,
    data: {
      summary: personnel.earnings,
      breakdown: earningsBreakdown,
    },
  });
});

// Admin functions

// @desc    Get all logistics personnel (Admin)
// @route   GET /api/logistics
// @access  Private (Admin)
const getAllLogisticsPersonnel = asyncHandler(async (req, res) => {
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
      { businessName: { $regex: search, $options: 'i' } },
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

  const personnel = await LogisticsPersonnel.paginate(query, options);

  res.json({
    success: true,
    data: personnel.docs,
    pagination: {
      page: personnel.page,
      pages: personnel.totalPages,
      total: personnel.totalDocs,
      limit: personnel.limit,
    },
  });
});

// @desc    Approve or reject logistics personnel (Admin)
// @route   PUT /api/logistics/:personnelId/approval
// @access  Private (Admin)
const updateApproval = asyncHandler(async (req, res) => {
  const { personnelId } = req.params;
  const { action, reason } = req.body; // action: 'approve' or 'reject'

  const personnel = await LogisticsPersonnel.findById(personnelId);
  if (!personnel) {
    return res.status(404).json({ message: 'Logistics personnel not found' });
  }

  if (action === 'approve') {
    personnel.status = 'approved';
    personnel.approvedBy = req.user.id;
    personnel.approvedAt = new Date();
    personnel.availabilityStatus = 'offline'; // Start as offline, personnel can change later
  } else if (action === 'reject') {
    personnel.status = 'rejected';
    personnel.rejectionReason = reason;
  } else {
    return res.status(400).json({ message: 'Invalid action' });
  }

  await personnel.save();

  res.json({
    success: true,
    data: personnel,
    message: `Logistics personnel ${action}d successfully`,
  });
});

// @desc    Suspend or reactivate logistics personnel (Admin)
// @route   PUT /api/logistics/:personnelId/suspension
// @access  Private (Admin)
const updateSuspension = asyncHandler(async (req, res) => {
  const { personnelId } = req.params;
  const { action, reason } = req.body; // action: 'suspend' or 'reactivate'

  const personnel = await LogisticsPersonnel.findById(personnelId);
  if (!personnel) {
    return res.status(404).json({ message: 'Logistics personnel not found' });
  }

  if (action === 'suspend') {
    personnel.status = 'suspended';
    personnel.suspendedAt = new Date();
    personnel.suspensionReason = reason;
    personnel.availabilityStatus = 'offline';
  } else if (action === 'reactivate') {
    personnel.status = 'active';
    personnel.suspendedAt = null;
    personnel.suspensionReason = null;
  } else {
    return res.status(400).json({ message: 'Invalid action' });
  }

  await personnel.save();

  res.json({
    success: true,
    data: personnel,
    message: `Logistics personnel ${action}d successfully`,
  });
});

module.exports = {
  registerLogisticsPersonnel,
  getLogisticsProfile,
  updateLogisticsProfile,
  updateAvailabilityStatus,
  getAssignments,
  updateDeliveryStatus,
  getStatistics,
  getEarnings,
  getAllLogisticsPersonnel,
  updateApproval,
  updateSuspension,
};
