const express = require('express');
const router = express.Router();
const { getActiveTrips, getTripStatistics } = require('../controllers/adminMonitoringController');
const { protect, authorize } = require('../middleware/auth');

router.get('/active-trips', protect, authorize('admin'), getActiveTrips);
router.get('/statistics', protect, authorize('admin'), getTripStatistics);

module.exports = router;
