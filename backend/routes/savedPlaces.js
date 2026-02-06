const express = require('express');
const router = express.Router();
const {
  createSavedPlace,
  getUserSavedPlaces,
  updateSavedPlace,
  deleteSavedPlace,
  incrementUsage,
} = require('../controllers/savedPlacesController');

const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.route('/')
  .post(createSavedPlace)
  .get(getUserSavedPlaces);

router.route('/:id')
  .put(updateSavedPlace)
  .delete(deleteSavedPlace);

router.put('/:id/usage', incrementUsage);

module.exports = router;