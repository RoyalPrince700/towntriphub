const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const DriverSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    // Personal Information
    dateOfBirth: {
      type: Date,
      required: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    licenseExpiryDate: {
      type: Date,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    emergencyContact: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      relationship: { type: String, required: true },
    },

    // Vehicle Information
    vehicle: {
      make: { type: String, required: true },
      model: { type: String, required: true },
      year: { type: Number, required: true, min: 2000, max: new Date().getFullYear() + 1 },
      color: { type: String, required: true },
      plateNumber: { type: String, required: true, unique: true, uppercase: true },
      vehicleType: {
        type: String,
        enum: ['car', 'motorcycle', 'truck', 'van'],
        required: true,
      },
      seatingCapacity: { type: Number, required: true, min: 1, max: 50 },
      hasAC: { type: Boolean, default: false },
      registrationNumber: { type: String, required: true, unique: true },
      registrationExpiry: { type: Date, required: true },
      insuranceNumber: { type: String, required: true },
      insuranceExpiry: { type: Date, required: true },
    },

    // Driver Status and Availability
    status: {
      type: String,
      enum: ['pending_approval', 'approved', 'rejected', 'suspended', 'active'],
      default: 'pending_approval',
    },
    availabilityStatus: {
      type: String,
      enum: ['offline', 'available', 'busy', 'on_trip'],
      default: 'offline',
    },

    // Location and Service Area
    currentLocation: {
      address: { type: String },
      coordinates: {
        latitude: { type: Number },
        longitude: { type: Number },
      },
      lastUpdated: { type: Date },
    },
    serviceAreas: [{
      type: String, // Areas like "Banjul", "Serrekunda", etc.
    }],

    // Ratings and Reviews
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      totalRatings: { type: Number, default: 0 },
      breakdown: {
        punctuality: { type: Number, default: 0, min: 0, max: 5 },
        professionalism: { type: Number, default: 0, min: 0, max: 5 },
        vehicle_condition: { type: Number, default: 0, min: 0, max: 5 },
        communication: { type: Number, default: 0, min: 0, max: 5 },
      },
    },

    // Earnings and Statistics
    earnings: {
      total: { type: Number, default: 0 },
      thisMonth: { type: Number, default: 0 },
      thisWeek: { type: Number, default: 0 },
      pending: { type: Number, default: 0 },
      lastPayout: { type: Date },
    },
    statistics: {
      totalTrips: { type: Number, default: 0 },
      completedTrips: { type: Number, default: 0 },
      cancelledTrips: { type: Number, default: 0 },
      totalDistance: { type: Number, default: 0 }, // in km
      totalHours: { type: Number, default: 0 }, // in hours
      averageTripTime: { type: Number, default: 0 }, // in minutes
    },

    // Admin and Approval Information
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: { type: Date },
    rejectionReason: { type: String },
    suspendedAt: { type: Date },
    suspensionReason: { type: String },

    // Preferences
    preferences: {
      acceptsDeliveries: { type: Boolean, default: true },
      acceptsRides: { type: Boolean, default: true },
      maxDistance: { type: Number, default: 50 }, // Maximum distance willing to travel (km)
      operatingHours: {
        start: { type: String, default: '06:00' }, // HH:MM format
        end: { type: String, default: '22:00' },
      },
      languages: [{ type: String }], // Languages spoken
    },

    // Documents (URLs to uploaded files)
    documents: {
      licensePhoto: { type: String },
      vehicleRegistration: { type: String },
      insuranceDocument: { type: String },
      vehiclePhoto: { type: String },
      profilePhoto: { type: String },
    },

    // Device and App Information
    deviceInfo: {
      fcmToken: { type: String }, // For push notifications
      appVersion: { type: String },
      lastLogin: { type: Date },
    },

    // Current Assignment
    currentBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
  },
  { timestamps: true }
);

// Indexes for efficient queries
DriverSchema.index({ user: 1 }, { unique: true });
DriverSchema.index({ status: 1 });
DriverSchema.index({ availabilityStatus: 1 });
DriverSchema.index({ 'currentLocation.coordinates': '2dsphere' });
DriverSchema.index({ 'rating.average': -1 });
DriverSchema.index({ serviceAreas: 1 });

// Virtual for driver's full profile
DriverSchema.virtual('fullProfile').get(function() {
  return {
    driverId: this._id,
    user: this.user,
    vehicle: this.vehicle,
    rating: this.rating,
    statistics: this.statistics,
    availabilityStatus: this.availabilityStatus,
    currentLocation: this.currentLocation,
  };
});

// Method to update driver location
DriverSchema.methods.updateLocation = function(latitude, longitude, address = null) {
  this.currentLocation.coordinates = { latitude, longitude };
  this.currentLocation.address = address || this.currentLocation.address;
  this.currentLocation.lastUpdated = new Date();
  return this.save();
};

// Method to calculate earnings for a completed booking
DriverSchema.methods.addEarnings = function(amount) {
  this.earnings.total += amount;
  this.earnings.pending += amount;

  // Update monthly earnings
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  if (!this.earnings.lastPayout || this.earnings.lastPayout < startOfMonth) {
    this.earnings.thisMonth += amount;
  }

  // Update weekly earnings
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  startOfWeek.setHours(0, 0, 0, 0);
  if (!this.earnings.lastPayout || this.earnings.lastPayout < startOfWeek) {
    this.earnings.thisWeek += amount;
  }

  return this.save();
};

// Method to update statistics
DriverSchema.methods.updateStatistics = function(booking) {
  this.statistics.totalTrips += 1;

  if (booking.status === 'completed') {
    this.statistics.completedTrips += 1;

    if (booking.distance) {
      this.statistics.totalDistance += booking.distance;
    }

    if (booking.actualDuration) {
      this.statistics.totalHours += booking.actualDuration / 60; // Convert minutes to hours
      this.statistics.averageTripTime = (this.statistics.averageTripTime * (this.statistics.completedTrips - 1) + booking.actualDuration) / this.statistics.completedTrips;
    }
  } else if (booking.status === 'cancelled') {
    this.statistics.cancelledTrips += 1;
  }
};

// Method to update rating
DriverSchema.methods.updateRating = function(newRating, breakdown = {}) {
  const totalRatings = this.rating.totalRatings;
  const currentAvg = this.rating.average;

  this.rating.totalRatings += 1;
  this.rating.average = ((currentAvg * totalRatings) + newRating) / (totalRatings + 1);

  // Update breakdown if provided
  if (breakdown.punctuality) {
    this.rating.breakdown.punctuality = ((this.rating.breakdown.punctuality * totalRatings) + breakdown.punctuality) / (totalRatings + 1);
  }
  if (breakdown.professionalism) {
    this.rating.breakdown.professionalism = ((this.rating.breakdown.professionalism * totalRatings) + breakdown.professionalism) / (totalRatings + 1);
  }
  if (breakdown.vehicle_condition) {
    this.rating.breakdown.vehicle_condition = ((this.rating.breakdown.vehicle_condition * totalRatings) + breakdown.vehicle_condition) / (totalRatings + 1);
  }
  if (breakdown.communication) {
    this.rating.breakdown.communication = ((this.rating.breakdown.communication * totalRatings) + breakdown.communication) / (totalRatings + 1);
  }

  return this.save();
};

// Method to check if driver is available for assignment
DriverSchema.methods.isAvailable = function() {
  return this.status === 'approved' &&
         this.availabilityStatus === 'available' &&
         !this.currentBooking;
};

// Method to assign booking to driver
DriverSchema.methods.assignBooking = function(bookingId) {
  this.currentBooking = bookingId;
  this.availabilityStatus = 'on_trip';
  return this.save();
};

// Method to complete current booking
DriverSchema.methods.completeBooking = function() {
  this.currentBooking = null;
  this.availabilityStatus = 'available';
  return this.save();
};

// Apply pagination plugin
DriverSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Driver', DriverSchema);