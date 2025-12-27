const express = require('express');
const { body, query, param } = require('express-validator');
const {
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
} = require('../controllers/logisticsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All logistics routes require authentication
router.use(protect);

// Logistics personnel registration
router.post(
  '/register',
  (req, res, next) => {
    ['businessAddress', 'serviceAreas', 'emergencyContact'].forEach(field => {
      if (typeof req.body[field] === 'string') {
        try { req.body[field] = JSON.parse(req.body[field]); } catch (e) {}
      }
    });
    next();
  },
  [
    body('dispatchName').optional().isLength({ min: 2 }).withMessage('Dispatch name must be at least 2 characters'),
    body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
    body('phoneNumber').matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/).withMessage('Valid phone number is required'),
    body('emergencyContact.name').isLength({ min: 2 }).withMessage('Emergency contact name is required'),
    body('emergencyContact.phone').matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/).withMessage('Valid emergency contact phone is required'),
    body('emergencyContact.relationship').isLength({ min: 2 }).withMessage('Emergency contact relationship is required'),
    body('businessName').optional().isLength({ min: 2 }).withMessage('Business name must be at least 2 characters'),
    body('businessAddress.address').isLength({ min: 5 }).withMessage('Business address is required'),
    body('serviceAreas').optional().isArray().withMessage('Service areas must be an array'),
    body('serviceAreas.*').optional().isString().withMessage('Service areas must be strings'),
  ],
  registerLogisticsPersonnel
);

// Logistics personnel profile management
router.get('/profile', getLogisticsProfile);

router.put(
  '/profile',
  [
    body('phoneNumber').optional().matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/).withMessage('Valid phone number is required'),
    body('emergencyContact.name').optional().isLength({ min: 2 }).withMessage('Emergency contact name must be at least 2 characters'),
    body('emergencyContact.phone').optional().matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/).withMessage('Valid emergency contact phone is required'),
    body('emergencyContact.relationship').optional().isLength({ min: 2 }).withMessage('Emergency contact relationship must be at least 2 characters'),
    body('serviceAreas').optional().isArray().withMessage('Service areas must be an array'),
    body('serviceAreas.*').optional().isString().withMessage('Service areas must be strings'),
    body('services').optional().isArray().withMessage('Services must be an array'),
    body('services.*').optional().isIn(['local_delivery', 'inter_city_delivery', 'express_delivery', 'heavy_lifting', 'specialized_transport']).withMessage('Invalid service type'),
    body('businessAddress.address').optional().isString().withMessage('Address must be a string'),
    body('businessAddress.coordinates.latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
    body('businessAddress.coordinates.longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
    body('operatingHours.start').optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Valid start time format HH:MM required'),
    body('operatingHours.end').optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Valid end time format HH:MM required'),
    body('operatingDays').optional().isArray().withMessage('Operating days must be an array'),
    body('operatingDays.*').optional().isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']).withMessage('Invalid day'),
    body('maxPackageWeight').optional().isFloat({ min: 0 }).withMessage('Max package weight must be non-negative'),
    body('maxPackageSize.length').optional().isFloat({ min: 0 }).withMessage('Length must be non-negative'),
    body('maxPackageSize.width').optional().isFloat({ min: 0 }).withMessage('Width must be non-negative'),
    body('maxPackageSize.height').optional().isFloat({ min: 0 }).withMessage('Height must be non-negative'),
    body('specialCapabilities').optional().isArray().withMessage('Special capabilities must be an array'),
    body('specialCapabilities.*').optional().isIn(['fragile_handling', 'temperature_controlled', 'hazardous_materials', 'oversized_items', 'international_shipping']).withMessage('Invalid capability'),
    body('preferences.acceptsFragileItems').optional().isBoolean().withMessage('Accepts fragile items must be boolean'),
    body('preferences.acceptsHeavyItems').optional().isBoolean().withMessage('Accepts heavy items must be boolean'),
    body('preferences.acceptsHazardousItems').optional().isBoolean().withMessage('Accepts hazardous items must be boolean'),
    body('preferences.acceptsInternational').optional().isBoolean().withMessage('Accepts international must be boolean'),
    body('preferences.maxDistance').optional().isFloat({ min: 1 }).withMessage('Max distance must be a positive number'),
    body('preferences.languages').optional().isArray().withMessage('Languages must be an array'),
  ],
  updateLogisticsProfile
);

// Availability status management
router.put(
  '/availability',
  [
    body('availabilityStatus').isIn(['offline', 'available', 'busy']).withMessage('Invalid availability status'),
  ],
  updateAvailabilityStatus
);

// Assignments and delivery management
router.get(
  '/assignments',
  [
    query('status').optional().isIn(['pending', 'driver_assigned', 'driver_en_route', 'picked_up', 'in_transit', 'completed', 'cancelled']).withMessage('Invalid status'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  ],
  getAssignments
);

router.put(
  '/assignments/:bookingId/status',
  [
    param('bookingId').isMongoId().withMessage('Invalid booking ID'),
    body('status').isIn(['driver_en_route', 'picked_up', 'in_transit', 'completed']).withMessage('Invalid delivery status'),
    body('location.address').optional().isString().withMessage('Address must be a string'),
    body('location.coordinates.latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
    body('location.coordinates.longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
  ],
  updateDeliveryStatus
);

// Statistics and earnings
router.get('/statistics', getStatistics);
router.get('/earnings', getEarnings);

// Admin routes
router.get(
  '/',
  authorize('admin'),
  [
    query('status').optional().isIn(['pending_approval', 'approved', 'rejected', 'suspended', 'active']).withMessage('Invalid status'),
    query('availabilityStatus').optional().isIn(['offline', 'available', 'busy', 'on_delivery']).withMessage('Invalid availability status'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('search').optional().isString().withMessage('Search must be a string'),
  ],
  getAllLogisticsPersonnel
);

router.put(
  '/:personnelId/approval',
  authorize('admin'),
  [
    param('personnelId').isMongoId().withMessage('Invalid personnel ID'),
    body('action').isIn(['approve', 'reject']).withMessage('Action must be approve or reject'),
    body('reason').optional().isString().isLength({ max: 500 }).withMessage('Reason must be less than 500 characters'),
  ],
  updateApproval
);

router.put(
  '/:personnelId/suspension',
  authorize('admin'),
  [
    param('personnelId').isMongoId().withMessage('Invalid personnel ID'),
    body('action').isIn(['suspend', 'reactivate']).withMessage('Action must be suspend or reactivate'),
    body('reason').optional().isString().isLength({ max: 500 }).withMessage('Reason must be less than 500 characters'),
  ],
  updateSuspension
);

module.exports = router;
