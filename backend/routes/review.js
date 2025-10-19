const express = require('express');
const { body, query, param } = require('express-validator');
const {
  createReview,
  getUserReviews,
  getGivenReviews,
  getReviewDetails,
  updateReview,
  deleteReview,
  getUserRatingStats,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All review routes require authentication
router.use(protect);

// Create a review
router.post(
  '/',
  [
    body('bookingId').isMongoId().withMessage('Invalid booking ID'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().isString().isLength({ max: 500 }),
    body('feedback.punctuality').optional().isInt({ min: 1, max: 5 }),
    body('feedback.professionalism').optional().isInt({ min: 1, max: 5 }),
    body('feedback.vehicle_condition').optional().isInt({ min: 1, max: 5 }),
    body('feedback.communication').optional().isInt({ min: 1, max: 5 }),
    body('feedback.package_handling').optional().isInt({ min: 1, max: 5 }),
  ],
  createReview
);

// Get reviews received by a user
router.get(
  '/user/:userId',
  [
    param('userId').isMongoId().withMessage('Invalid user ID'),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('type').optional().isIn(['user_to_driver', 'driver_to_user']),
  ],
  getUserReviews
);

// Get reviews given by current user
router.get(
  '/given',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('type').optional().isIn(['user_to_driver', 'driver_to_user']),
  ],
  getGivenReviews
);

// Get user rating statistics (public route)
router.get(
  '/stats/:userId',
  [
    param('userId').isMongoId().withMessage('Invalid user ID'),
  ],
  getUserRatingStats
);

// Get single review details
router.get(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid review ID'),
  ],
  getReviewDetails
);

// Update a review
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid review ID'),
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().isString().isLength({ max: 500 }),
    body('feedback.punctuality').optional().isInt({ min: 1, max: 5 }),
    body('feedback.professionalism').optional().isInt({ min: 1, max: 5 }),
    body('feedback.vehicle_condition').optional().isInt({ min: 1, max: 5 }),
    body('feedback.communication').optional().isInt({ min: 1, max: 5 }),
    body('feedback.package_handling').optional().isInt({ min: 1, max: 5 }),
  ],
  updateReview
);

// Delete a review
router.delete(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid review ID'),
  ],
  deleteReview
);

module.exports = router;
