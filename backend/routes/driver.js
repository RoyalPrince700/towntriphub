const express = require('express');
const { body, query, param } = require('express-validator');
const {
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
} = require('../controllers/driverController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All driver routes require authentication
router.use(protect);

// Driver registration
router.post(
  '/register',
  (req, res, next) => {
    ['vehicle', 'preferences', 'serviceAreas', 'emergencyContact'].forEach(field => {
      if (typeof req.body[field] === 'string') {
        try { req.body[field] = JSON.parse(req.body[field]); } catch (e) {}
      }
    });
    next();
  },
  [
    body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
    body('licenseNumber').isLength({ min: 5, max: 20 }).withMessage('License number must be 5-20 characters'),
    body('licenseExpiryDate').isISO8601().withMessage('Valid license expiry date is required'),
    body('phoneNumber').matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/).withMessage('Valid phone number is required'),
    body('emergencyContact.name').isLength({ min: 2 }).withMessage('Emergency contact name is required'),
    body('emergencyContact.phone').matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/).withMessage('Valid emergency contact phone is required'),
    body('emergencyContact.relationship').isLength({ min: 2 }).withMessage('Emergency contact relationship is required'),
    body('vehicle.make').isLength({ min: 2 }).withMessage('Vehicle make is required'),
    body('vehicle.model').isLength({ min: 2 }).withMessage('Vehicle model is required'),
    body('vehicle.year').isInt({ min: 2000, max: new Date().getFullYear() + 1 }).withMessage('Valid vehicle year is required'),
    body('vehicle.color').isLength({ min: 2 }).withMessage('Vehicle color is required'),
    body('vehicle.plateNumber').isLength({ min: 3, max: 10 }).withMessage('Valid plate number is required'),
    body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'truck', 'van']).withMessage('Valid vehicle type is required'),
    body('vehicle.seatingCapacity').isInt({ min: 1, max: 50 }).withMessage('Valid seating capacity is required'),
    body('vehicle.registrationNumber').isLength({ min: 3 }).withMessage('Registration number is required'),
    body('vehicle.registrationExpiry').isISO8601().withMessage('Valid registration expiry date is required'),
    body('vehicle.insuranceNumber').isLength({ min: 3 }).withMessage('Insurance number is required'),
    body('vehicle.insuranceExpiry').isISO8601().withMessage('Valid insurance expiry date is required'),
    body('serviceAreas').optional().isArray().withMessage('Service areas must be an array'),
    body('serviceAreas.*').optional().isString().withMessage('Service areas must be strings'),
    body('preferences.acceptsDeliveries').optional().isBoolean().withMessage('Accepts deliveries must be boolean'),
    body('preferences.acceptsRides').optional().isBoolean().withMessage('Accepts rides must be boolean'),
    body('preferences.operatingHours.start').optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Valid start time format HH:MM required'),
    body('preferences.operatingHours.end').optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Valid end time format HH:MM required'),
    body('preferences.languages').optional().isArray().withMessage('Languages must be an array'),
    body('preferences.languages.*').optional().isString().withMessage('Languages must be strings'),
  ],
  registerDriver
);

// Driver profile management
router.get('/profile', getDriverProfile);

router.put(
  '/profile',
  [
    body('phoneNumber').optional().matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/).withMessage('Valid phone number is required'),
    body('emergencyContact.name').optional().isLength({ min: 2 }).withMessage('Emergency contact name must be at least 2 characters'),
    body('emergencyContact.phone').optional().matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/).withMessage('Valid emergency contact phone is required'),
    body('emergencyContact.relationship').optional().isLength({ min: 2 }).withMessage('Emergency contact relationship must be at least 2 characters'),
    body('serviceAreas').optional().isArray().withMessage('Service areas must be an array'),
    body('serviceAreas.*').optional().isString().withMessage('Service areas must be strings'),
    body('preferences.acceptsDeliveries').optional().isBoolean().withMessage('Accepts deliveries must be boolean'),
    body('preferences.acceptsRides').optional().isBoolean().withMessage('Accepts rides must be boolean'),
    body('preferences.maxDistance').optional().isFloat({ min: 1 }).withMessage('Max distance must be a positive number'),
    body('preferences.operatingHours.start').optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Valid start time format HH:MM required'),
    body('preferences.operatingHours.end').optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Valid end time format HH:MM required'),
    body('preferences.languages').optional().isArray().withMessage('Languages must be an array'),
    body('currentLocation.address').optional().isString().withMessage('Address must be a string'),
    body('currentLocation.coordinates.latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
    body('currentLocation.coordinates.longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
  ],
  updateDriverProfile
);

// Availability status management
router.put(
  '/availability',
  [
    body('availabilityStatus').isIn(['offline', 'available', 'busy']).withMessage('Invalid availability status'),
  ],
  updateAvailabilityStatus
);

// Vehicle management
router.put(
  '/vehicle',
  [
    body('make').optional().isLength({ min: 2 }).withMessage('Vehicle make must be at least 2 characters'),
    body('model').optional().isLength({ min: 2 }).withMessage('Vehicle model must be at least 2 characters'),
    body('year').optional().isInt({ min: 2000, max: new Date().getFullYear() + 1 }).withMessage('Valid vehicle year is required'),
    body('color').optional().isLength({ min: 2 }).withMessage('Vehicle color must be at least 2 characters'),
    body('plateNumber').optional().isLength({ min: 3, max: 10 }).withMessage('Valid plate number is required'),
    body('vehicleType').optional().isIn(['car', 'motorcycle', 'truck', 'van']).withMessage('Valid vehicle type is required'),
    body('seatingCapacity').optional().isInt({ min: 1, max: 50 }).withMessage('Valid seating capacity is required'),
    body('hasAC').optional().isBoolean().withMessage('Has AC must be boolean'),
    body('registrationExpiry').optional().isISO8601().withMessage('Valid registration expiry date is required'),
    body('insuranceExpiry').optional().isISO8601().withMessage('Valid insurance expiry date is required'),
  ],
  updateVehicleInfo
);

// Assignments and trip management
router.get(
  '/assignments',
  [
    query('status').optional().isIn(['pending', 'driver_assigned', 'driver_en_route', 'picked_up', 'in_transit', 'completed', 'cancelled']).withMessage('Invalid status'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  ],
  getDriverAssignments
);

router.put(
  '/assignments/:bookingId/status',
  [
    param('bookingId').isMongoId().withMessage('Invalid booking ID'),
    body('status').isIn(['driver_en_route', 'picked_up', 'in_transit', 'completed']).withMessage('Invalid trip status'),
    body('location.address').optional().isString().withMessage('Address must be a string'),
    body('location.coordinates.latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
    body('location.coordinates.longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
  ],
  updateTripStatus
);

// Statistics and earnings
router.get('/statistics', getDriverStatistics);
router.get('/earnings', getDriverEarnings);

// Admin routes
router.get(
  '/',
  authorize('admin'),
  [
    query('status').optional().isIn(['pending_approval', 'approved', 'rejected', 'suspended', 'active']).withMessage('Invalid status'),
    query('availabilityStatus').optional().isIn(['offline', 'available', 'busy', 'on_trip']).withMessage('Invalid availability status'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('search').optional().isString().withMessage('Search must be a string'),
  ],
  getAllDrivers
);

router.put(
  '/:driverId/approval',
  authorize('admin'),
  [
    param('driverId').isMongoId().withMessage('Invalid driver ID'),
    body('action').isIn(['approve', 'reject']).withMessage('Action must be approve or reject'),
    body('reason').optional().isString().isLength({ max: 500 }).withMessage('Reason must be less than 500 characters'),
  ],
  updateDriverApproval
);

router.put(
  '/:driverId/suspension',
  authorize('admin'),
  [
    param('driverId').isMongoId().withMessage('Invalid driver ID'),
    body('action').isIn(['suspend', 'reactivate']).withMessage('Action must be suspend or reactivate'),
    body('reason').optional().isString().isLength({ max: 500 }).withMessage('Reason must be less than 500 characters'),
  ],
  updateDriverSuspension
);

module.exports = router;
