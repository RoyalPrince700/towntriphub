const express = require('express');
const { body, query, param } = require('express-validator');
const {
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
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All booking routes require authentication
router.use(protect);

// Ride booking routes
router.post(
  '/ride',
  [
    body('pickupLocation.address').isString().notEmpty().withMessage('Pickup address is required'),
    body('pickupLocation.coordinates.latitude').optional().isFloat({ min: -90, max: 90 }),
    body('pickupLocation.coordinates.longitude').optional().isFloat({ min: -180, max: 180 }),
    body('destinationLocation.address').isString().notEmpty().withMessage('Destination address is required'),
    body('destinationLocation.coordinates.latitude').optional().isFloat({ min: -90, max: 90 }),
    body('destinationLocation.coordinates.longitude').optional().isFloat({ min: -180, max: 180 }),
  ],
  createRideBooking
);

// Delivery booking routes
router.post(
  '/delivery',
  [
    body('pickupLocation.address').isString().notEmpty().withMessage('Pickup address is required'),
    body('pickupLocation.coordinates.latitude').optional().isFloat({ min: -90, max: 90 }),
    body('pickupLocation.coordinates.longitude').optional().isFloat({ min: -180, max: 180 }),
    body('destinationLocation.address').isString().notEmpty().withMessage('Destination address is required'),
    body('destinationLocation.coordinates.latitude').optional().isFloat({ min: -90, max: 90 }),
    body('destinationLocation.coordinates.longitude').optional().isFloat({ min: -180, max: 180 }),
    body('packageDetails.description').optional().isString().isLength({ max: 500 }),
    body('packageDetails.weight').optional().isFloat({ min: 0 }),
    body('packageDetails.dimensions.length').optional().isFloat({ min: 0 }),
    body('packageDetails.dimensions.width').optional().isFloat({ min: 0 }),
    body('packageDetails.dimensions.height').optional().isFloat({ min: 0 }),
    body('packageDetails.value').optional().isFloat({ min: 0 }),
    body('packageDetails.isFragile').optional().isBoolean(),
    body('packageDetails.specialInstructions').optional().isString().isLength({ max: 500 }),
  ],
  createDeliveryBooking
);

// Get user's bookings with filtering and pagination
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isIn(['pending', 'driver_assigned', 'driver_en_route', 'picked_up', 'in_transit', 'completed', 'cancelled']),
    query('type').optional().isIn(['ride', 'delivery']),
  ],
  getUserBookings
);

// Get booking statistics
router.get('/stats', getBookingStats);

// Admin routes (must come before parameterized routes)
router.get(
  '/admin',
  protect,
  authorize('admin'),
  [
    query('status').optional().isIn(['pending', 'driver_assigned', 'driver_en_route', 'picked_up', 'in_transit', 'completed', 'cancelled']).withMessage('Invalid status'),
    query('type').optional().isIn(['ride', 'delivery']).withMessage('Invalid type'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('search').optional().isString().withMessage('Search must be a string'),
    query('dateFrom').optional().isISO8601().withMessage('Invalid date format'),
    query('dateTo').optional().isISO8601().withMessage('Invalid date format'),
  ],
  getAllBookings
);

router.put(
  '/:id/assign-driver',
  protect,
  authorize('admin'),
  [
    param('id').isMongoId().withMessage('Invalid booking ID'),
    body('driverId').isMongoId().withMessage('Invalid driver ID'),
    body('price.amount').isFloat({ min: 0 }).withMessage('Valid price amount is required'),
    body('price.currency').optional().isString().withMessage('Valid currency is required'),
  ],
  assignDriver
);

// Get single booking details
router.get(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid booking ID'),
  ],
  getBookingDetails
);

// Cancel booking
router.put(
  '/:id/cancel',
  [
    param('id').isMongoId().withMessage('Invalid booking ID'),
    body('reason').optional().isString().isLength({ max: 500 }),
  ],
  cancelBooking
);

// Confirm payment for completed booking
router.put(
  '/:id/confirm-payment',
  [
    param('id').isMongoId().withMessage('Invalid booking ID'),
  ],
  confirmPayment
);

router.get(
  '/available-drivers',
  protect,
  authorize('admin'),
  [
    query('pickupLocation').optional().isString().withMessage('Pickup location must be a string'),
    query('type').optional().isIn(['ride', 'delivery']).withMessage('Invalid type'),
  ],
  getAvailableDrivers
);

module.exports = router;
