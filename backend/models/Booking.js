const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const BookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['ride', 'delivery'],
      required: true,
    },
    // Ride booking fields
    pickupLocation: {
      address: { type: String, required: true },
      coordinates: {
        latitude: { type: Number },
        longitude: { type: Number },
      },
    },
    destinationLocation: {
      address: { type: String, required: true },
      coordinates: {
        latitude: { type: Number },
        longitude: { type: Number },
      },
    },
    // Delivery booking fields
    packageDetails: {
      description: { type: String },
      weight: { type: Number }, // in kg
      dimensions: {
        length: { type: Number }, // in cm
        width: { type: Number }, // in cm
        height: { type: Number }, // in cm
      },
      value: { type: Number }, // estimated value in GMD
      isFragile: { type: Boolean, default: false },
      specialInstructions: { type: String },
    },
    // Common fields
    status: {
      type: String,
      enum: [
        'pending',
        'driver_assigned',
        'driver_en_route',
        'picked_up',
        'in_transit',
        'completed',
        'cancelled'
      ],
      default: 'pending',
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
    },
    price: {
      amount: { type: Number },
      currency: { type: String, default: 'GMD' },
      setAt: { type: Date },
      setBy: { type: String, enum: ['admin', 'driver'] },
    },
    payment: {
      method: {
        type: String,
        enum: ['cash', 'transfer'],
        default: 'cash',
      },
      status: {
        type: String,
        enum: ['pending', 'confirmed', 'failed'],
        default: 'pending',
      },
      confirmedAt: { type: Date },
      confirmedBy: { type: String, enum: ['user', 'admin'] },
    },
    // Timestamps for tracking
    requestedAt: { type: Date, default: Date.now },
    driverAssignedAt: { type: Date },
    driverEnRouteAt: { type: Date },
    pickedUpAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
    // Additional tracking
    estimatedDuration: { type: Number }, // in minutes
    actualDuration: { type: Number }, // in minutes
    distance: { type: Number }, // in km
    // Admin notes
    adminNotes: { type: String },
    // Cancellation details
    cancellationReason: { type: String },
    cancelledBy: { type: String, enum: ['user', 'driver', 'admin'] },
  },
  { timestamps: true }
);

// Add pagination plugin
BookingSchema.plugin(mongoosePaginate);

// Indexes for efficient queries
BookingSchema.index({ user: 1, createdAt: -1 });
BookingSchema.index({ driver: 1, status: 1 });
BookingSchema.index({ status: 1, createdAt: -1 });
BookingSchema.index({ type: 1, status: 1 });

// Virtual for completion rate
BookingSchema.virtual('isCompleted').get(function() {
  return this.status === 'completed';
});

// Method to calculate total earnings for driver
BookingSchema.methods.calculateEarnings = function() {
  if (this.status !== 'completed' || !this.price.amount) return 0;
  // Platform fee could be deducted here (e.g., 10% platform fee)
  const platformFee = this.price.amount * 0.1;
  return this.price.amount - platformFee;
};

module.exports = mongoose.model('Booking', BookingSchema);
