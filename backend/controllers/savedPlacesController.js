const SavedPlace = require('../models/SavedPlace');
const asyncHandler = require('express-async-handler');

// @desc    Create a new saved place
// @route   POST /api/saved-places
// @access  Private
const createSavedPlace = asyncHandler(async (req, res) => {
  const { name, address, coordinates, type } = req.body;

  // Check if user already has a saved place with this name
  const existingPlace = await SavedPlace.findOne({
    user: req.user._id,
    name: name.trim(),
    type,
  });

  if (existingPlace) {
    res.status(400);
    throw new Error('You already have a saved place with this name');
  }

  const placeData = {
    user: req.user._id,
    name: name.trim(),
    address: address.trim(),
    type,
  };

  // Only include coordinates if provided
  if (coordinates) {
    placeData.coordinates = coordinates;
  }

  const savedPlace = await SavedPlace.create(placeData);

  const populatedPlace = await SavedPlace.findById(savedPlace._id).populate('user', 'name email');

  res.status(201).json({
    success: true,
    data: populatedPlace,
    message: 'Saved place created successfully',
  });
});

// @desc    Get user's saved places
// @route   GET /api/saved-places
// @access  Private
const getUserSavedPlaces = asyncHandler(async (req, res) => {
  const { type, limit = 50, page = 1 } = req.query;

  const query = { user: req.user._id, isActive: true };
  if (type) {
    query.type = type;
  }

  const options = {
    limit: parseInt(limit),
    page: parseInt(page),
    sort: { usageCount: -1, createdAt: -1 },
    populate: {
      path: 'user',
      select: 'name email',
    },
  };

  const result = await SavedPlace.paginate(query, options);

  res.status(200).json({
    success: true,
    data: result.docs,
    pagination: {
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
      limit: result.limit,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
      nextPage: result.nextPage,
      prevPage: result.prevPage,
    },
  });
});

// @desc    Update a saved place
// @route   PUT /api/saved-places/:id
// @access  Private
const updateSavedPlace = asyncHandler(async (req, res) => {
  const { name, address, coordinates } = req.body;

  const savedPlace = await SavedPlace.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!savedPlace) {
    res.status(404);
    throw new Error('Saved place not found');
  }

  // Check if another saved place with the same name exists (excluding current one)
  if (name && name !== savedPlace.name) {
    const existingPlace = await SavedPlace.findOne({
      user: req.user._id,
      name: name.trim(),
      type: savedPlace.type,
      _id: { $ne: req.params.id },
    });

    if (existingPlace) {
      res.status(400);
      throw new Error('You already have a saved place with this name');
    }
  }

  // Update fields
  if (name) savedPlace.name = name.trim();
  if (address) savedPlace.address = address.trim();
  if (coordinates) savedPlace.coordinates = coordinates;

  await savedPlace.save();

  const updatedPlace = await SavedPlace.findById(savedPlace._id).populate('user', 'name email');

  res.status(200).json({
    success: true,
    data: updatedPlace,
    message: 'Saved place updated successfully',
  });
});

// @desc    Delete a saved place
// @route   DELETE /api/saved-places/:id
// @access  Private
const deleteSavedPlace = asyncHandler(async (req, res) => {
  const savedPlace = await SavedPlace.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!savedPlace) {
    res.status(404);
    throw new Error('Saved place not found');
  }

  // Soft delete by setting isActive to false
  savedPlace.isActive = false;
  await savedPlace.save();

  res.status(200).json({
    success: true,
    message: 'Saved place deleted successfully',
  });
});

// @desc    Increment usage count for a saved place
// @route   PUT /api/saved-places/:id/usage
// @access  Private
const incrementUsage = asyncHandler(async (req, res) => {
  const savedPlace = await SavedPlace.findOne({
    _id: req.params.id,
    user: req.user._id,
    isActive: true,
  });

  if (!savedPlace) {
    res.status(404);
    throw new Error('Saved place not found');
  }

  await savedPlace.incrementUsage();

  res.status(200).json({
    success: true,
    message: 'Usage count incremented',
  });
});

module.exports = {
  createSavedPlace,
  getUserSavedPlaces,
  updateSavedPlace,
  deleteSavedPlace,
  incrementUsage,
};