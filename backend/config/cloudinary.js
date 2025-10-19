const cloudinary = require('cloudinary').v2;

// Cloudinary configuration
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

// Check if Cloudinary is properly configured
const isConfigured = CLOUD_NAME && API_KEY && API_SECRET &&
  CLOUD_NAME !== 'your_cloud_name' && API_KEY !== 'your_api_key' && API_SECRET !== 'your_api_secret';

if (isConfigured) {
  try {
    cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: API_KEY,
      api_secret: API_SECRET,
    });
    console.log('✓ Cloudinary service initialized');
  } catch (error) {
    console.warn('⚠ Cloudinary configuration failed:', error.message);
  }
} else {
  console.warn('⚠ Cloudinary not configured - file uploads will not work');
}

module.exports = {
  cloudinary,
  isConfigured,
};
