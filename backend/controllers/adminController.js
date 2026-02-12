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
  
  if (role) {
    query.role = role;
  } else {
    // By default, exclude driver and logistics roles in User Management
    query.role = { $in: ['user', 'admin'] };
  }

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

// @desc    Update user role
// @route   PUT /api/admin/users/:userId/role
// @access  Private (Admin)
const updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role. Only user and admin are allowed.' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Prevent admin from changing their own role (optional but safer)
  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({ message: 'You cannot change your own role' });
  }

  user.role = role;
  await user.save();

  res.json({
    success: true,
    data: user,
    message: `User role updated to ${role}`,
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

// @desc    Get analytics data for charts
// @route   GET /api/admin/analytics
// @access  Private (Admin)
const getAnalytics = asyncHandler(async (req, res) => {
  const { period = '30' } = req.query; // Default to last 30 days
  const days = parseInt(period, 10);
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  // Bookings over time (daily)
  const bookingsOverTime = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        count: { $sum: 1 },
        revenue: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$price.amount', 0] } }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  // Bookings by type
  const bookingsByType = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 }
      }
    }
  ]);

  // Bookings by status
  const bookingsByStatus = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Revenue over time (daily)
  const revenueOverTime = await Booking.aggregate([
    {
      $match: {
        status: 'completed',
        'price.amount': { $exists: true, $ne: null },
        $or: [
          { completedAt: { $gte: startDate } },
          { completedAt: null, updatedAt: { $gte: startDate } }
        ]
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: { $ifNull: ['$completedAt', '$updatedAt'] }
          }
        },
        revenue: { $sum: '$price.amount' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  // User growth over time
  const userGrowth = await User.aggregate([
    {
      $match: {
        role: { $ne: 'admin' },
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  // Driver growth over time
  const driverGrowth = await Driver.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  // Logistics personnel growth over time
  const logisticsGrowth = await LogisticsPersonnel.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  // Average booking value over time
  const avgBookingValue = await Booking.aggregate([
    {
      $match: {
        status: 'completed',
        'price.amount': { $exists: true, $ne: null },
        $or: [
          { completedAt: { $gte: startDate } },
          { completedAt: null, updatedAt: { $gte: startDate } }
        ]
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: { $ifNull: ['$completedAt', '$updatedAt'] }
          }
        },
        avgValue: { $avg: '$price.amount' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  // Top performing drivers (by completed bookings)
  const topDrivers = await Booking.aggregate([
    {
      $match: {
        status: 'completed',
        driver: { $exists: true },
        'price.amount': { $exists: true, $ne: null },
        $or: [
          { completedAt: { $gte: startDate } },
          { completedAt: null, updatedAt: { $gte: startDate } }
        ]
      }
    },
    {
      $group: {
        _id: '$driver',
        completedBookings: { $sum: 1 },
        totalRevenue: { $sum: '$price.amount' }
      }
    },
    {
      $sort: { completedBookings: -1 }
    },
    {
      $limit: 10
    },
    {
      $lookup: {
        from: 'drivers',
        localField: '_id',
        foreignField: '_id',
        as: 'driverInfo'
      }
    },
    {
      $unwind: '$driverInfo'
    },
    {
      $lookup: {
        from: 'users',
        localField: 'driverInfo.user',
        foreignField: '_id',
        as: 'userInfo'
      }
    },
    {
      $unwind: '$userInfo'
    },
    {
      $project: {
        driverName: '$userInfo.name',
        completedBookings: 1,
        totalRevenue: 1
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      bookingsOverTime: bookingsOverTime.map(item => ({
        date: item._id,
        bookings: item.count,
        revenue: item.revenue || 0
      })),
      revenueOverTime: revenueOverTime.map(item => ({
        date: item._id,
        revenue: item.revenue || 0,
        bookings: item.count
      })),
      bookingsByType: bookingsByType.map(item => ({
        type: item._id,
        count: item.count
      })),
      bookingsByStatus: bookingsByStatus.map(item => ({
        status: item._id,
        count: item.count
      })),
      userGrowth: userGrowth.map(item => ({
        date: item._id,
        count: item.count
      })),
      driverGrowth: driverGrowth.map(item => ({
        date: item._id,
        count: item.count
      })),
      logisticsGrowth: logisticsGrowth.map(item => ({
        date: item._id,
        count: item.count
      })),
      avgBookingValue: avgBookingValue.map(item => ({
        date: item._id,
        avgValue: Math.round(item.avgValue || 0),
        count: item.count
      })),
      topDrivers: topDrivers.map(item => ({
        name: item.driverName,
        completedBookings: item.completedBookings,
        totalRevenue: item.totalRevenue || 0
      }))
    }
  });
});

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  getSystemSettings,
  updateSystemSettings,
  getAnalytics,
};
