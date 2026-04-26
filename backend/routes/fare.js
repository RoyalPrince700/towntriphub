const express = require('express');
const router = express.Router();
const {
  calculateFareEstimate,
  getFareRanges,
  getPricingConfig
} = require('../controllers/fareController');
const { protect } = require('../middleware/auth');

// Calculate fare estimate for booking
router.post('/estimate', protect, calculateFareEstimate);

// Get fare ranges for different vehicle types
router.get('/ranges', protect, getFareRanges);

// Get pricing configuration
router.get('/config', protect, getPricingConfig);

module.exports = router;