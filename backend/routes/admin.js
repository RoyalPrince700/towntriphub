const express = require('express');
const { body, query, param } = require('express-validator');
const {
  getAdminStats,
  getAllUsers,
  updateUserStatus,
  getSystemSettings,
  updateSystemSettings,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Admin dashboard statistics
router.get(
  '/stats',
  getAdminStats
);

// User management
router.get(
  '/users',
  [
    query('status').optional().isIn(['verified', 'unverified']).withMessage('Invalid status'),
    query('role').optional().isIn(['user', 'driver', 'logistics']).withMessage('Invalid role'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('search').optional().isString().withMessage('Search must be a string'),
  ],
  getAllUsers
);

router.put(
  '/users/:userId/status',
  [
    param('userId').isMongoId().withMessage('Invalid user ID'),
    body('status').isIn(['verified', 'unverified']).withMessage('Status must be verified or unverified'),
  ],
  updateUserStatus
);

// System settings
router.get('/settings', getSystemSettings);

router.put(
  '/settings',
  [
    body('platformFee').optional().isFloat({ min: 0, max: 1 }).withMessage('Platform fee must be between 0 and 1'),
    body('maxBookingDistance').optional().isFloat({ min: 1 }).withMessage('Max booking distance must be positive'),
    body('driverApprovalRequired').optional().isBoolean().withMessage('Driver approval required must be boolean'),
    body('logisticsApprovalRequired').optional().isBoolean().withMessage('Logistics approval required must be boolean'),
    body('emailNotifications').optional().isBoolean().withMessage('Email notifications must be boolean'),
    body('smsNotifications').optional().isBoolean().withMessage('SMS notifications must be boolean'),
  ],
  updateSystemSettings
);

module.exports = router;
