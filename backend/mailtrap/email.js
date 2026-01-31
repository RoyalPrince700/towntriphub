const { client, sender, isConfigured } = require('./mailtrap.config');

class EmailService {
  /**
   * Send a welcome email to new users
   * @param {string} toEmail - Recipient email address
   * @param {string} userName - User's name
   * @param {string} verificationToken - Email verification token
   */
  async sendWelcomeEmail(toEmail, userName, verificationToken) {
    if (!isConfigured || !client) {
      console.log(`[Email Skipped] Welcome email to ${toEmail} - Mailtrap not configured`);
      return; // Don't throw error, just skip sending
    }

    try {
      const welcomeTemplate = require('./emailtemplate').getWelcomeTemplate(userName, verificationToken);

      await client.send({
        from: sender,
        to: [{ email: toEmail }],
        subject: 'Welcome to TownTripHub - Verify Your Account',
        html: welcomeTemplate,
        category: 'Welcome',
      });

      console.log(`Welcome email sent to ${toEmail}`);
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw new Error('Failed to send welcome email');
    }
  }

  /**
   * Send password reset email
   * @param {string} toEmail - Recipient email address
   * @param {string} userName - User's name
   * @param {string} resetToken - Password reset token
   */
  async sendPasswordResetEmail(toEmail, userName, resetToken) {
    if (!isConfigured || !client) {
      console.log(`[Email Skipped] Password reset email to ${toEmail} - Mailtrap not configured`);
      return; // Don't throw error, just skip sending
    }

    try {
      const resetTemplate = require('./emailtemplate').getPasswordResetTemplate(userName, resetToken);

      await client.send({
        from: sender,
        to: [{ email: toEmail }],
        subject: 'TownTripHub - Password Reset Request',
        html: resetTemplate,
        category: 'Password Reset',
      });

      console.log(`Password reset email sent to ${toEmail}`);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  /**
   * Send booking confirmation email
   * @param {string} toEmail - Recipient email address
   * @param {string} userName - User's name
   * @param {Object} bookingDetails - Booking information
   */
  async sendBookingConfirmation(toEmail, userName, bookingDetails) {
    if (!isConfigured || !client) {
      console.log(`[Email Skipped] Booking confirmation email to ${toEmail} - Mailtrap not configured`);
      return; // Don't throw error, just skip sending
    }

    try {
      const bookingTemplate = require('./emailtemplate').getBookingConfirmationTemplate(userName, bookingDetails);

      await client.send({
        from: sender,
        to: [{ email: toEmail }],
        subject: 'TownTripHub - Booking Confirmed',
        html: bookingTemplate,
        category: 'Booking Confirmation',
      });

      console.log(`Booking confirmation email sent to ${toEmail}`);
    } catch (error) {
      console.error('Error sending booking confirmation email:', error);
      throw new Error('Failed to send booking confirmation email');
    }
  }

  /**
   * Send driver approval notification
   * @param {string} toEmail - Driver's email address
   * @param {string} driverName - Driver's name
   */
  async sendDriverApprovalEmail(toEmail, driverName) {
    if (!isConfigured || !client) {
      console.log(`[Email Skipped] Driver approval email to ${toEmail} - Mailtrap not configured`);
      return; // Don't throw error, just skip sending
    }

    try {
      const approvalTemplate = require('./emailtemplate').getDriverApprovalTemplate(driverName);

      await client.send({
        from: sender,
        to: [{ email: toEmail }],
        subject: 'TownTripHub - Driver Account Approved',
        html: approvalTemplate,
        category: 'Driver Approval',
      });

      console.log(`Driver approval email sent to ${toEmail}`);
    } catch (error) {
      console.error('Error sending driver approval email:', error);
      throw new Error('Failed to send driver approval email');
    }
  }

  /**
   * Send trip completion notification
   * @param {string} toEmail - Recipient email address
   * @param {string} userName - User's name
   * @param {Object} tripDetails - Trip information
   */
  async sendTripCompletionEmail(toEmail, userName, tripDetails) {
    if (!isConfigured || !client) {
      console.log(`[Email Skipped] Trip completion email to ${toEmail} - Mailtrap not configured`);
      return;
    }

    try {
      const completionTemplate = require('./emailtemplate').getTripCompletionTemplate(userName, tripDetails);

      await client.send({
        from: sender,
        to: [{ email: toEmail }],
        subject: 'TownTripHub - Trip Completed',
        html: completionTemplate,
        category: 'Trip Completion',
      });

      console.log(`Trip completion email sent to ${toEmail}`);
    } catch (error) {
      console.error('Error sending trip completion email:', error);
    }
  }

  /**
   * Send new booking notification to Admin
   * @param {Object} bookingDetails - Booking information
   */
  async sendAdminBookingNotification(bookingDetails) {
    if (!isConfigured || !client) {
      console.log('[Email Skipped] Admin booking notification - Mailtrap not configured');
      return;
    }

    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@towntriphub.com';
      const adminTemplate = require('./emailtemplate').getAdminBookingNotificationTemplate(bookingDetails);

      await client.send({
        from: sender,
        to: [{ email: adminEmail }],
        subject: `[New Booking] ${bookingDetails.type.toUpperCase()} - ${bookingDetails.bookingId}`,
        html: adminTemplate,
        category: 'Admin Notification',
      });

      console.log(`Admin booking notification sent to ${adminEmail}`);
    } catch (error) {
      console.error('Error sending admin booking notification:', error);
    }
  }

  /**
   * Send driver assignment notification to Driver
   * @param {string} toEmail - Driver's email
   * @param {string} driverName - Driver's name
   * @param {Object} userDetails - User information
   * @param {Object} bookingDetails - Booking information
   */
  async sendDriverAssignmentNotification(toEmail, driverName, userDetails, bookingDetails) {
    if (!isConfigured || !client) {
      console.log(`[Email Skipped] Driver assignment email to ${toEmail} - Mailtrap not configured`);
      return;
    }

    try {
      const driverTemplate = require('./emailtemplate').getDriverAssignmentNotificationTemplate(driverName, userDetails, bookingDetails);

      await client.send({
        from: sender,
        to: [{ email: toEmail }],
        subject: 'TownTripHub - New Assignment Assigned',
        html: driverTemplate,
        category: 'Driver Assignment',
      });

      console.log(`Driver assignment email sent to ${toEmail}`);
    } catch (error) {
      console.error('Error sending driver assignment email:', error);
    }
  }

  /**
   * Send driver details to User upon assignment
   * @param {string} toEmail - User's email
   * @param {string} userName - User's name
   * @param {Object} driverDetails - Driver information
   * @param {Object} bookingDetails - Booking information
   */
  async sendUserAssignmentNotification(toEmail, userName, driverDetails, bookingDetails) {
    if (!isConfigured || !client) {
      console.log(`[Email Skipped] User assignment email to ${toEmail} - Mailtrap not configured`);
      return;
    }

    try {
      const userTemplate = require('./emailtemplate').getUserAssignmentNotificationTemplate(userName, driverDetails, bookingDetails);

      await client.send({
        from: sender,
        to: [{ email: toEmail }],
        subject: 'TownTripHub - Driver Assigned to Your Booking',
        html: userTemplate,
        category: 'User Assignment',
      });

      console.log(`User assignment email sent to ${toEmail}`);
    } catch (error) {
      console.error('Error sending user assignment email:', error);
    }
  }

  /**
   * Send ride status update notification to User
   * @param {string} toEmail - User's email
   * @param {string} userName - User's name
   * @param {string} status - New status
   * @param {Object} bookingDetails - Booking information
   */
  async sendRideStatusUpdateEmail(toEmail, userName, status, bookingDetails) {
    if (!isConfigured || !client) {
      console.log(`[Email Skipped] Status update email to ${toEmail} - Mailtrap not configured`);
      return;
    }

    try {
      const statusTemplate = require('./emailtemplate').getRideStatusUpdateTemplate(userName, status, bookingDetails);

      await client.send({
        from: sender,
        to: [{ email: toEmail }],
        subject: `TownTripHub - Booking Update: ${status.replace(/_/g, ' ').toUpperCase()}`,
        html: statusTemplate,
        category: 'Status Update',
      });

      console.log(`Status update email sent to ${toEmail}`);
    } catch (error) {
      console.error('Error sending status update email:', error);
    }
  }
}

module.exports = new EmailService();
