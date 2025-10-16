class EmailTemplates {
  /**
   * Get welcome email template
   * @param {string} userName - User's name
   * @param {string} verificationToken - Email verification token
   * @returns {string} HTML email template
   */
  getWelcomeTemplate(userName, verificationToken) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to TownTripHub</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Welcome to TownTripHub!</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName}!</h2>
          <p>Thank you for joining TownTripHub, The Gambia's premier ride-booking platform. We're excited to have you on board!</p>

          <p>To get started, please verify your email address by clicking the button below:</p>

          <a href="${verificationUrl}" class="button">Verify My Email</a>

          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p><a href="${verificationUrl}">${verificationUrl}</a></p>

          <p>If you didn't create an account with TownTripHub, please ignore this email.</p>

          <p>Best regards,<br>The TownTripHub Team</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 TownTripHub. All rights reserved.</p>
          <p>If you have any questions, contact us at support@towntriphub.com</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get password reset email template
   * @param {string} userName - User's name
   * @param {string} resetToken - Password reset token
   * @returns {string} HTML email template
   */
  getPasswordResetTemplate(userName, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - TownTripHub</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          .warning { background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName},</h2>
          <p>You have requested to reset your password for your TownTripHub account.</p>

          <div class="warning">
            <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
          </div>

          <p>Click the button below to reset your password:</p>

          <a href="${resetUrl}" class="button">Reset My Password</a>

          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>

          <p>This link will expire in 1 hour for security reasons.</p>

          <p>Best regards,<br>The TownTripHub Team</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 TownTripHub. All rights reserved.</p>
          <p>If you have any questions, contact us at support@towntriphub.com</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get booking confirmation email template
   * @param {string} userName - User's name
   * @param {Object} bookingDetails - Booking information
   * @returns {string} HTML email template
   */
  getBookingConfirmationTemplate(userName, bookingDetails) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmed - TownTripHub</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #16a34a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .booking-details { background-color: white; padding: 20px; border-radius: 6px; margin: 20px 0; border: 1px solid #e5e7eb; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Booking Confirmed!</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName},</h2>
          <p>Your ride has been successfully booked! Here are your booking details:</p>

          <div class="booking-details">
            <h3>Booking Details</h3>
            <p><strong>Booking ID:</strong> ${bookingDetails.bookingId || 'TTH-' + Date.now()}</p>
            <p><strong>Pickup Location:</strong> ${bookingDetails.pickupLocation || 'N/A'}</p>
            <p><strong>Destination:</strong> ${bookingDetails.destination || 'N/A'}</p>
            <p><strong>Scheduled Time:</strong> ${bookingDetails.scheduledTime || 'N/A'}</p>
            <p><strong>Estimated Fare:</strong> GMD ${bookingDetails.estimatedFare || 'N/A'}</p>
            <p><strong>Driver:</strong> ${bookingDetails.driverName || 'To be assigned'}</p>
            <p><strong>Vehicle:</strong> ${bookingDetails.vehicleInfo || 'To be assigned'}</p>
            <p><strong>Status:</strong> ${bookingDetails.status || 'Confirmed'}</p>
          </div>

          <p>You will receive updates about your driver assignment and trip progress. You can also track your trip in your dashboard.</p>

          <p>If you need to make any changes to your booking, please contact us immediately.</p>

          <p>Safe travels!</p>
          <p>Best regards,<br>The TownTripHub Team</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 TownTripHub. All rights reserved.</p>
          <p>If you have any questions, contact us at support@towntriphub.com</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get driver approval email template
   * @param {string} driverName - Driver's name
   * @returns {string} HTML email template
   */
  getDriverApprovalTemplate(driverName) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Driver Account Approved - TownTripHub</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #16a34a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Congratulations!</h1>
        </div>
        <div class="content">
          <h2>Hello ${driverName},</h2>
          <p>Congratulations! Your driver account has been approved and is now active on TownTripHub.</p>

          <p>You can now:</p>
          <ul>
            <li>Receive ride requests from passengers</li>
            <li>Accept or decline booking requests</li>
            <li>View your trip history and earnings</li>
            <li>Update your vehicle and profile information</li>
            <li>Access your driver dashboard</li>
          </ul>

          <p>Please ensure your profile is complete and your vehicle information is up to date. You should also familiarize yourself with our driver guidelines and safety protocols.</p>

          <p>Welcome to the TownTripHub driver community!</p>

          <p>Best regards,<br>The TownTripHub Team</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 TownTripHub. All rights reserved.</p>
          <p>If you have any questions, contact us at support@towntriphub.com</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get trip completion email template
   * @param {string} userName - User's name
   * @param {Object} tripDetails - Trip information
   * @returns {string} HTML email template
   */
  getTripCompletionTemplate(userName, tripDetails) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Trip Completed - TownTripHub</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #16a34a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .trip-details { background-color: white; padding: 20px; border-radius: 6px; margin: 20px 0; border: 1px solid #e5e7eb; }
          .rating-section { background-color: #fff3cd; padding: 20px; border-radius: 6px; margin: 20px 0; text-align: center; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Trip Completed Successfully!</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName},</h2>
          <p>Your trip has been completed successfully! Thank you for choosing TownTripHub.</p>

          <div class="trip-details">
            <h3>Trip Summary</h3>
            <p><strong>Trip ID:</strong> ${tripDetails.tripId || 'TTH-' + Date.now()}</p>
            <p><strong>Pickup Location:</strong> ${tripDetails.pickupLocation || 'N/A'}</p>
            <p><strong>Destination:</strong> ${tripDetails.destination || 'N/A'}</p>
            <p><strong>Driver:</strong> ${tripDetails.driverName || 'N/A'}</p>
            <p><strong>Vehicle:</strong> ${tripDetails.vehicleInfo || 'N/A'}</p>
            <p><strong>Actual Fare:</strong> GMD ${tripDetails.actualFare || 'N/A'}</p>
            <p><strong>Payment Method:</strong> ${tripDetails.paymentMethod || 'N/A'}</p>
            <p><strong>Completion Time:</strong> ${tripDetails.completionTime || new Date().toLocaleString()}</p>
          </div>

          <div class="rating-section">
            <h3>How was your ride?</h3>
            <p>Your feedback helps us improve our service and helps other passengers choose reliable drivers.</p>
            <p>Please take a moment to rate your driver and leave a review in your dashboard.</p>
          </div>

          <p>Thank you for riding with TownTripHub. We hope to serve you again soon!</p>

          <p>Best regards,<br>The TownTripHub Team</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 TownTripHub. All rights reserved.</p>
          <p>If you have any questions, contact us at support@towntriphub.com</p>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailTemplates();
