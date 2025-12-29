const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ReviewSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true, // One review per booking
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['user_to_driver', 'driver_to_user'],
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    // Additional feedback categories
    feedback: {
      punctuality: { type: Number, min: 1, max: 5 },
      professionalism: { type: Number, min: 1, max: 5 },
      vehicle_condition: { type: Number, min: 1, max: 5 },
      communication: { type: Number, min: 1, max: 5 },
      package_handling: { type: Number, min: 1, max: 5 }, // Only for deliveries
    },
    // Anonymous review option
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    // Admin moderation
    isApproved: {
      type: Boolean,
      default: true, // Auto-approve for now, can add moderation later
    },
    adminNotes: { type: String },
  },
  { timestamps: true }
);

// Indexes for efficient queries
ReviewSchema.index({ reviewer: 1, createdAt: -1 });
ReviewSchema.index({ reviewee: 1, createdAt: -1 });
ReviewSchema.index({ booking: 1 }, { unique: true });
ReviewSchema.index({ type: 1, rating: -1 });

// Virtual for average rating calculation
ReviewSchema.virtual('averageRating').get(function() {
  const ratings = [
    this.rating,
    this.feedback.punctuality,
    this.feedback.professionalism,
    this.feedback.vehicle_condition,
    this.feedback.communication,
  ].filter(r => r != null);

  if (this.booking.type === 'delivery' && this.feedback.package_handling) {
    ratings.push(this.feedback.package_handling);
  }

  return ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
});

// Add pagination support for list endpoints
ReviewSchema.plugin(mongoosePaginate);

// Static method to get average rating for a user
ReviewSchema.statics.getAverageRating = async function(userId, type = null) {
  const matchCondition = { reviewee: userId };
  if (type) {
    matchCondition.type = type;
  }

  const result = await this.aggregate([
    { $match: matchCondition },
    {
      $group: {
        _id: '$reviewee',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  return result.length > 0 ? {
    averageRating: Math.round(result[0].averageRating * 10) / 10,
    totalReviews: result[0].totalReviews,
  } : { averageRating: 0, totalReviews: 0 };
};

module.exports = mongoose.model('Review', ReviewSchema);
