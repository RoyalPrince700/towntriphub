const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const LogisticsPersonnelSchema = new mongoose.Schema(
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
    phoneNumber: {
      type: String,
      required: true,
    },
    emergencyContact: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      relationship: { type: String, required: true },
    },

    // Business/Service Information
    businessName: { type: String, required: true },
    businessType: {
      type: String,
      enum: ['individual', 'small_business', 'company'],
      default: 'individual',
    },
    serviceAreas: [{
      type: String, // Areas like "Banjul", "Serrekunda", etc.
    }],
    services: [{
      type: String,
      enum: ['local_delivery', 'inter_city_delivery', 'express_delivery', 'heavy_lifting', 'specialized_transport'],
    }],

    // Fleet Information (if applicable)
    hasVehicles: { type: Boolean, default: false },
    fleetSize: { type: Number, default: 0, min: 0 },
    vehicleTypes: [{
      type: String,
      enum: ['bicycle', 'motorcycle', 'car', 'van', 'truck', 'pickup', 'other'],
    }],

    // Capacity and Capabilities
    maxPackageWeight: { type: Number, default: 50 }, // in kg
    maxPackageSize: {
      length: { type: Number }, // in cm
      width: { type: Number },
      height: { type: Number },
    },
    specialCapabilities: [{
      type: String,
      enum: ['fragile_handling', 'temperature_controlled', 'hazardous_materials', 'oversized_items', 'international_shipping'],
    }],

    // Operational Information
    operatingHours: {
      start: { type: String, default: '08:00' }, // HH:MM format
      end: { type: String, default: '18:00' },
    },
    operatingDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      default: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    }],

    // Status and Availability
    status: {
      type: String,
      enum: ['pending_approval', 'approved', 'rejected', 'suspended', 'active'],
      default: 'pending_approval',
    },
    availabilityStatus: {
      type: String,
      enum: ['offline', 'available', 'busy', 'on_delivery'],
      default: 'offline',
    },

    // Location
    businessAddress: {
      address: { type: String, required: true },
      coordinates: {
        latitude: { type: Number },
        longitude: { type: Number },
      },
    },
    serviceRadius: { type: Number, default: 25 }, // in km

    // Ratings and Reviews
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      totalRatings: { type: Number, default: 0 },
      breakdown: {
        punctuality: { type: Number, default: 0, min: 0, max: 5 },
        professionalism: { type: Number, default: 0, min: 0, max: 5 },
        package_handling: { type: Number, default: 0, min: 0, max: 5 },
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
      totalDeliveries: { type: Number, default: 0 },
      completedDeliveries: { type: Number, default: 0 },
      cancelledDeliveries: { type: Number, default: 0 },
      totalDistance: { type: Number, default: 0 }, // in km
      totalHours: { type: Number, default: 0 }, // in hours
      averageDeliveryTime: { type: Number, default: 0 }, // in minutes
      onTimeDeliveryRate: { type: Number, default: 0 }, // percentage
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

    // Documents (URLs to uploaded files)
    documents: {
      businessLicense: { type: String },
      taxCertificate: { type: String },
      insuranceDocument: { type: String },
      vehicleRegistration: { type: String }, // if applicable
      vehicleFrontPhoto: { type: String },
      vehicleSidePhoto: { type: String },
      vehicleBackPhoto: { type: String },
      profilePhoto: { type: String },
      businessPhoto: { type: String },
    },

    // Preferences
    preferences: {
      acceptsFragileItems: { type: Boolean, default: true },
      acceptsHeavyItems: { type: Boolean, default: true },
      acceptsHazardousItems: { type: Boolean, default: false },
      acceptsInternational: { type: Boolean, default: false },
      maxDistance: { type: Number, default: 100 }, // Maximum delivery distance (km)
      languages: [{ type: String }], // Languages spoken
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
LogisticsPersonnelSchema.index({ user: 1 }, { unique: true });
LogisticsPersonnelSchema.index({ status: 1 });
LogisticsPersonnelSchema.index({ availabilityStatus: 1 });
LogisticsPersonnelSchema.index({ 'businessAddress.coordinates': '2dsphere' });
LogisticsPersonnelSchema.index({ 'rating.average': -1 });
LogisticsPersonnelSchema.index({ serviceAreas: 1 });
LogisticsPersonnelSchema.index({ services: 1 });

// Virtual for logistics personnel's full profile
LogisticsPersonnelSchema.virtual('fullProfile').get(function() {
  return {
    logisticsId: this._id,
    user: this.user,
    businessName: this.businessName,
    services: this.services,
    rating: this.rating,
    statistics: this.statistics,
    availabilityStatus: this.availabilityStatus,
    businessAddress: this.businessAddress,
  };
});

// Method to update business location
LogisticsPersonnelSchema.methods.updateLocation = function(latitude, longitude, address = null) {
  this.businessAddress.coordinates = { latitude, longitude };
  this.businessAddress.address = address || this.businessAddress.address;
  return this.save();
};

// Method to calculate earnings for a completed delivery
LogisticsPersonnelSchema.methods.addEarnings = function(amount) {
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
LogisticsPersonnelSchema.methods.updateStatistics = function(booking) {
  this.statistics.totalDeliveries += 1;

  if (booking.status === 'completed') {
    this.statistics.completedDeliveries += 1;

    if (booking.distance) {
      this.statistics.totalDistance += booking.distance;
    }

    if (booking.actualDuration) {
      this.statistics.totalHours += booking.actualDuration / 60; // Convert minutes to hours
      this.statistics.averageDeliveryTime = (this.statistics.averageDeliveryTime * (this.statistics.completedDeliveries - 1) + booking.actualDuration) / this.statistics.completedDeliveries;
    }
  } else if (booking.status === 'cancelled') {
    this.statistics.cancelledDeliveries += 1;
  }
};

// Method to update rating
LogisticsPersonnelSchema.methods.updateRating = function(newRating, breakdown = {}) {
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
  if (breakdown.package_handling) {
    this.rating.breakdown.package_handling = ((this.rating.breakdown.package_handling * totalRatings) + breakdown.package_handling) / (totalRatings + 1);
  }
  if (breakdown.communication) {
    this.rating.breakdown.communication = ((this.rating.breakdown.communication * totalRatings) + breakdown.communication) / (totalRatings + 1);
  }

  return this.save();
};

// Method to check if logistics personnel is available for assignment
LogisticsPersonnelSchema.methods.isAvailable = function() {
  return this.status === 'approved' &&
         this.availabilityStatus === 'available' &&
         !this.currentBooking;
};

// Method to assign booking to logistics personnel
LogisticsPersonnelSchema.methods.assignBooking = function(bookingId) {
  this.currentBooking = bookingId;
  this.availabilityStatus = 'on_delivery';
  return this.save();
};

// Method to complete current booking
LogisticsPersonnelSchema.methods.completeBooking = function() {
  this.currentBooking = null;
  this.availabilityStatus = 'available';
  return this.save();
};

// Apply pagination plugin
LogisticsPersonnelSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('LogisticsPersonnel', LogisticsPersonnelSchema);
