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
      return; // Don't throw error, just skip sending
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
      throw new Error('Failed to send trip completion email');
    }
  }
}

module.exports = new EmailService();
