const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const { cloudinary, isConfigured } = require('../config/cloudinary');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// Helper function for validation errors
function buildValidationError(res, errors) {
  return res.status(400).json({ errors: errors.array() });
}

// @desc    Upload profile picture
// @route   POST /api/upload/profile-picture
// @access  Private (User)
const uploadProfilePicture = asyncHandler(async (req, res) => {
  if (!isConfigured) {
    return res.status(503).json({
      message: 'File upload service is not configured',
    });
  }

  if (!req.files || !req.files.image) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  const file = req.files.image;

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.mimetype)) {
    return res.status(400).json({
      message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed',
    });
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return res.status(400).json({
      message: 'File too large. Maximum size is 5MB',
    });
  }

  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'towntriphub/profiles',
      width: 300,
      height: 300,
      crop: 'fill',
      gravity: 'face',
      quality: 'auto',
      format: 'jpg',
      public_id: `user_${req.user.id}_${Date.now()}`,
    });

    // Delete temp file
    if (fs.existsSync(file.tempFilePath)) {
      fs.unlinkSync(file.tempFilePath);
    }

    // Update user profile with new avatar URL
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarUrl: result.secure_url },
      { new: true }
    ).select('name email avatarUrl');

    res.json({
      success: true,
      data: {
        avatarUrl: result.secure_url,
        user,
      },
      message: 'Profile picture uploaded successfully',
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);

    // Delete temp file if it exists
    if (req.files && req.files.image && req.files.image.tempFilePath && fs.existsSync(req.files.image.tempFilePath)) {
      fs.unlinkSync(req.files.image.tempFilePath);
    }

    res.status(500).json({
      message: 'Failed to upload image',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// @desc    Delete profile picture
// @route   DELETE /api/upload/profile-picture
// @access  Private (User)
const deleteProfilePicture = asyncHandler(async (req, res) => {
  if (!isConfigured) {
    return res.status(503).json({
      message: 'File upload service is not configured',
    });
  }

  const user = await User.findById(req.user.id).select('avatarUrl');

  if (!user.avatarUrl) {
    return res.status(400).json({ message: 'No profile picture to delete' });
  }

  try {
    // Extract public ID from Cloudinary URL
    const urlParts = user.avatarUrl.split('/');
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    const publicId = `towntriphub/profiles/${publicIdWithExtension.split('.')[0]}`;

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Update user profile
    user.avatarUrl = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Profile picture deleted successfully',
    });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    res.status(500).json({
      message: 'Failed to delete image',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// @desc    Upload booking attachment (for delivery proofs, etc.)
// @route   POST /api/upload/booking-attachment/:bookingId
// @access  Private (User/Driver/Admin)
const uploadBookingAttachment = asyncHandler(async (req, res) => {
  if (!isConfigured) {
    return res.status(503).json({
      message: 'File upload service is not configured',
    });
  }

  const { bookingId } = req.params;

  if (!req.files || !req.files.file) {
    return res.status(400).json({ message: 'No file provided' });
  }

  const file = req.files.file;
  const { type } = req.body; // 'proof_of_delivery', 'damage_report', etc.

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
  if (!allowedTypes.includes(file.mimetype)) {
    return res.status(400).json({
      message: 'Invalid file type. Only images and PDFs are allowed',
    });
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    return res.status(400).json({
      message: 'File too large. Maximum size is 10MB',
    });
  }

  try {
    // Upload to Cloudinary
    const folder = type === 'proof_of_delivery' ? 'towntriphub/deliveries' : 'towntriphub/bookings';
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder,
      public_id: `booking_${bookingId}_${type}_${Date.now()}`,
      resource_type: file.mimetype === 'application/pdf' ? 'raw' : 'image',
    });

    // Delete temp file
    if (fs.existsSync(file.tempFilePath)) {
      fs.unlinkSync(file.tempFilePath);
    }

    res.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        type,
        uploadedAt: new Date(),
      },
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);

    // Delete temp file if it exists
    if (req.files && req.files.file && req.files.file.tempFilePath && fs.existsSync(req.files.file.tempFilePath)) {
      fs.unlinkSync(req.files.file.tempFilePath);
    }

    res.status(500).json({
      message: 'Failed to upload file',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = {
  uploadProfilePicture,
  deleteProfilePicture,
  uploadBookingAttachment,
};
