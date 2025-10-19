const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Driver = require('../models/Driver');
const LogisticsPersonnel = require('../models/LogisticsPersonnel');
const Booking = require('../models/Booking');

// Helper function for validation errors
function buildValidationError(res, errors) {
  return res.status(400).json({ errors: errors.array() });
}

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = asyncHandler(async (req, res) => {
  // Get overall statistics
  const [
    totalUsers,
    totalDrivers,
    totalLogistics,
    totalBookings,
    pendingBookings,
    completedBookings,
    totalRevenue,
    pendingApprovals,
  ] = await Promise.all([
    // Total users (excluding admin)
    User.countDocuments({ role: { $ne: 'admin' } }),

    // Total drivers
    Driver.countDocuments(),

    // Total logistics personnel
    LogisticsPersonnel.countDocuments(),

    // Total bookings
    Booking.countDocuments(),

    // Pending bookings
    Booking.countDocuments({ status: 'pending' }),

    // Completed bookings
    Booking.countDocuments({ status: 'completed' }),

    // Total revenue from completed bookings
    Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$price.amount' } } }
    ]),

    // Pending approvals (drivers + logistics with pending_approval status)
    Promise.all([
      Driver.countDocuments({ status: 'pending_approval' }),
      LogisticsPersonnel.countDocuments({ status: 'pending_approval' }),
    ]).then(([drivers, logistics]) => drivers + logistics),
  ]);

  // Get recent activity (last 10 bookings)
  const recentBookings = await Booking.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('user', 'name email')
    .populate('driver', 'user')
    .populate({
      path: 'driver',
      populate: {
        path: 'user',
        select: 'name email',
      },
    })
    .select('type status pickupLocation destinationLocation createdAt price driverAssignedAt completedAt');

  // Get driver statistics
  const driverStats = await Driver.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Get logistics statistics
  const logisticsStats = await LogisticsPersonnel.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Format driver stats
  const formattedDriverStats = {
    total: driverStats.reduce((sum, stat) => sum + stat.count, 0),
    approved: driverStats.find(stat => stat._id === 'approved')?.count || 0,
    pending_approval: driverStats.find(stat => stat._id === 'pending_approval')?.count || 0,
    suspended: driverStats.find(stat => stat._id === 'suspended')?.count || 0,
  };

  // Format logistics stats
  const formattedLogisticsStats = {
    total: logisticsStats.reduce((sum, stat) => sum + stat.count, 0),
    approved: logisticsStats.find(stat => stat._id === 'approved')?.count || 0,
    pending_approval: logisticsStats.find(stat => stat._id === 'pending_approval')?.count || 0,
    suspended: logisticsStats.find(stat => stat._id === 'suspended')?.count || 0,
  };

  // Get today's bookings
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todaysBookings = await Booking.countDocuments({
    createdAt: { $gte: today, $lt: tomorrow },
  });

  res.json({
    success: true,
    data: {
      overview: {
        totalUsers,
        totalDrivers: formattedDriverStats.total,
        totalLogistics: formattedLogisticsStats.total,
        totalBookings,
        pendingBookings,
        completedBookings,
        todaysBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingApprovals,
      },
      driverStats: formattedDriverStats,
      logisticsStats: formattedLogisticsStats,
      recentBookings,
    },
  });
});

// @desc    Get all users for admin management
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const {
    status,
    role,
    page = 1,
    limit = 10,
    search,
  } = req.query;

  const query = {};

  if (status) query.isEmailVerified = status === 'verified';
  if (role) query.role = role;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
  };

  const users = await User.paginate(query, options);

  res.json({
    success: true,
    data: users.docs,
    pagination: {
      page: users.page,
      pages: users.totalPages,
      total: users.totalDocs,
      limit: users.limit,
    },
  });
});

// @desc    Update user status
// @route   PUT /api/admin/users/:userId/status
// @access  Private (Admin)
const updateUserStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // For now, just update email verification status
  // In future, might add suspension/blocking functionality
  if (status === 'verified') {
    user.isEmailVerified = true;
  } else if (status === 'unverified') {
    user.isEmailVerified = false;
  } else {
    return res.status(400).json({ message: 'Invalid status' });
  }

  await user.save();

  res.json({
    success: true,
    data: user,
    message: `User status updated to ${status}`,
  });
});

// @desc    Get system settings
// @route   GET /api/admin/settings
// @access  Private (Admin)
const getSystemSettings = asyncHandler(async (req, res) => {
  // For now, return basic settings
  // In future, this could be stored in database
  const settings = {
    platformFee: 0.1, // 10% platform fee
    maxBookingDistance: 100, // km
    driverApprovalRequired: true,
    logisticsApprovalRequired: true,
    emailNotifications: true,
    smsNotifications: false,
  };

  res.json({
    success: true,
    data: settings,
  });
});

// @desc    Update system settings
// @route   PUT /api/admin/settings
// @access  Private (Admin)
const updateSystemSettings = asyncHandler(async (req, res) => {
  const { platformFee, maxBookingDistance, driverApprovalRequired, logisticsApprovalRequired, emailNotifications, smsNotifications } = req.body;

  // For now, just validate and return success
  // In future, store in database
  const updatedSettings = {
    platformFee: platformFee || 0.1,
    maxBookingDistance: maxBookingDistance || 100,
    driverApprovalRequired: driverApprovalRequired !== undefined ? driverApprovalRequired : true,
    logisticsApprovalRequired: logisticsApprovalRequired !== undefined ? logisticsApprovalRequired : true,
    emailNotifications: emailNotifications !== undefined ? emailNotifications : true,
    smsNotifications: smsNotifications !== undefined ? smsNotifications : false,
  };

  res.json({
    success: true,
    data: updatedSettings,
    message: 'System settings updated successfully',
  });
});

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUserStatus,
  getSystemSettings,
  updateSystemSettings,
};
