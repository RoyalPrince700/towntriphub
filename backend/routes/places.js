const express = require('express');
const router = express.Router();
const { getPlaceAutocomplete, getPlaceDetails, getDirections } = require('../controllers/placesController');
const { protect } = require('../middleware/auth');

router.get('/autocomplete', protect, getPlaceAutocomplete);
router.get('/details/:placeId', protect, getPlaceDetails);
router.get('/directions', protect, getDirections);

module.exports = router;