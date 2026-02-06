const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const SavedPlaceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a name for this saved place'],
      trim: true,
      maxlength: 50,
    },
    address: {
      type: String,
      required: [true, 'Please provide an address'],
      trim: true,
    },
    coordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90,
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180,
      },
    },
    type: {
      type: String,
      enum: ['pickup', 'destination'],
      required: true,
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Add pagination plugin
SavedPlaceSchema.plugin(mongoosePaginate);

// Indexes for efficient queries
SavedPlaceSchema.index({ user: 1, type: 1 });
SavedPlaceSchema.index({ user: 1, usageCount: -1 });
SavedPlaceSchema.index({ user: 1, createdAt: -1 });

// Method to increment usage count
SavedPlaceSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  return this.save();
};

module.exports = mongoose.model('SavedPlace', SavedPlaceSchema);