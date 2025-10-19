const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const User = require('../models/User');

// Helper function for validation errors
function buildValidationError(res, errors) {
  return res.status(400).json({ errors: errors.array() });
}

// @desc    Create a review for a completed booking
// @route   POST /api/reviews
// @access  Private (User)
const createReview = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return buildValidationError(res, errors);
  }

  const { bookingId, rating, comment, feedback } = req.body;

  // Check if booking exists and belongs to user
  const booking = await Booking.findById(bookingId)
    .populate('driver', 'user')
    .populate('user', 'name email');

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  // Check if user owns this booking
  if (booking.user.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to review this booking' });
  }

  // Check if booking is completed
  if (booking.status !== 'completed') {
    return res.status(400).json({ message: 'Can only review completed bookings' });
  }

  // Check if booking already has a review
  const existingReview = await Review.findOne({ booking: bookingId });
  if (existingReview) {
    return res.status(400).json({ message: 'Booking already reviewed' });
  }

  // Determine reviewer and reviewee based on user role
  const reviewer = req.user.id;
  const reviewee = booking.driver ? booking.driver.user.toString() : null;

  if (!reviewee) {
    return res.status(400).json({ message: 'No driver assigned to this booking' });
  }

  // Create review
  const review = await Review.create({
    booking: bookingId,
    reviewer,
    reviewee,
    type: 'user_to_driver',
    rating,
    comment,
    feedback: feedback || {},
  });

  const populatedReview = await Review.findById(review._id)
    .populate('reviewer', 'name email avatarUrl')
    .populate('reviewee', 'name email avatarUrl')
    .populate('booking', 'type status');

  res.status(201).json({
    success: true,
    data: populatedReview,
    message: 'Review submitted successfully',
  });
});

// @desc    Get reviews for a user (received reviews)
// @route   GET /api/reviews/user/:userId
// @access  Private
const getUserReviews = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10, type } = req.query;

  // Users can only see their own reviews or admins can see all
  if (req.user.id !== userId && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to view these reviews' });
  }

  const query = { reviewee: userId };
  if (type) query.type = type;

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
    populate: [
      { path: 'reviewer', select: 'name email avatarUrl' },
      { path: 'booking', select: 'type status pickupLocation destinationLocation' },
    ],
  };

  const reviews = await Review.paginate(query, options);

  res.json({
    success: true,
    data: reviews.docs,
    pagination: {
      page: reviews.page,
      pages: reviews.totalPages,
      total: reviews.totalDocs,
      limit: reviews.limit,
    },
  });
});

// @desc    Get reviews given by a user (sent reviews)
// @route   GET /api/reviews/given
// @access  Private (User)
const getGivenReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, type } = req.query;

  const query = { reviewer: req.user.id };
  if (type) query.type = type;

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
    populate: [
      { path: 'reviewee', select: 'name email avatarUrl' },
      { path: 'booking', select: 'type status pickupLocation destinationLocation' },
    ],
  };

  const reviews = await Review.paginate(query, options);

  res.json({
    success: true,
    data: reviews.docs,
    pagination: {
      page: reviews.page,
      pages: reviews.totalPages,
      total: reviews.totalDocs,
      limit: reviews.limit,
    },
  });
});

// @desc    Get single review details
// @route   GET /api/reviews/:id
// @access  Private
const getReviewDetails = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
    .populate('reviewer', 'name email avatarUrl')
    .populate('reviewee', 'name email avatarUrl')
    .populate('booking', 'type status pickupLocation destinationLocation packageDetails');

  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  // Check if user is involved in this review or is admin
  const isReviewer = review.reviewer._id.toString() === req.user.id;
  const isReviewee = review.reviewee._id.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isReviewer && !isReviewee && !isAdmin) {
    return res.status(403).json({ message: 'Not authorized to view this review' });
  }

  res.json({
    success: true,
    data: review,
  });
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private (Reviewer only)
const updateReview = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return buildValidationError(res, errors);
  }

  const { rating, comment, feedback } = req.body;

  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  // Only reviewer can update their review
  if (review.reviewer.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to update this review' });
  }

  // Update review
  review.rating = rating || review.rating;
  review.comment = comment !== undefined ? comment : review.comment;
  if (feedback) {
    review.feedback = { ...review.feedback, ...feedback };
  }

  await review.save();

  const updatedReview = await Review.findById(review._id)
    .populate('reviewer', 'name email avatarUrl')
    .populate('reviewee', 'name email avatarUrl')
    .populate('booking', 'type status');

  res.json({
    success: true,
    data: updatedReview,
    message: 'Review updated successfully',
  });
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Reviewer only or Admin)
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  // Only reviewer or admin can delete
  const isReviewer = review.reviewer.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isReviewer && !isAdmin) {
    return res.status(403).json({ message: 'Not authorized to delete this review' });
  }

  await review.deleteOne();

  res.json({
    success: true,
    message: 'Review deleted successfully',
  });
});

// @desc    Get user rating statistics
// @route   GET /api/reviews/stats/:userId
// @access  Public (for public profiles)
const getUserRatingStats = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const stats = await Review.getAverageRating(userId);

  // Get rating distribution
  const ratingDistribution = await Review.aggregate([
    { $match: { reviewee: userId } },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: -1 } },
  ]);

  // Convert to object format
  const distribution = {};
  ratingDistribution.forEach(item => {
    distribution[item._id] = item.count;
  });

  // Fill missing ratings with 0
  for (let i = 1; i <= 5; i++) {
    if (!distribution[i]) distribution[i] = 0;
  }

  res.json({
    success: true,
    data: {
      ...stats,
      ratingDistribution: distribution,
    },
  });
});

module.exports = {
  createReview,
  getUserReviews,
  getGivenReviews,
  getReviewDetails,
  updateReview,
  deleteReview,
  getUserRatingStats,
};
