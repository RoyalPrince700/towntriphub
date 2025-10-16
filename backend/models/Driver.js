const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    licenseNumber: {
      type: String,
      required: [true, 'Please add a license number'],
      unique: true,
      trim: true,
    },
    vehicleMake: { type: String, trim: true },
    vehicleModel: { type: String, trim: true },
    vehiclePlate: { type: String, trim: true },
    isApproved: { type: Boolean, default: false },
    onlineStatus: { type: String, enum: ['online', 'offline'], default: 'offline' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Driver', DriverSchema);


