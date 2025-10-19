const express = require('express');
const { param, body } = require('express-validator');
const {
  uploadProfilePicture,
  deleteProfilePicture,
  uploadBookingAttachment,
} = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All upload routes require authentication
router.use(protect);

// Upload profile picture
router.post('/profile-picture', uploadProfilePicture);

// Delete profile picture
router.delete('/profile-picture', deleteProfilePicture);

// Upload booking attachment
router.post(
  '/booking-attachment/:bookingId',
  [
    param('bookingId').isMongoId().withMessage('Invalid booking ID'),
    body('type').optional().isIn(['proof_of_delivery', 'damage_report', 'pickup_proof', 'other']).withMessage('Invalid attachment type'),
  ],
  uploadBookingAttachment
);

module.exports = router;
