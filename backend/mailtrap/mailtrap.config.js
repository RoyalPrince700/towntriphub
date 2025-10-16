const { MailtrapClient } = require('mailtrap');

const TOKEN = process.env.MAILTRAP_TOKEN;
const ENDPOINT = process.env.MAILTRAP_ENDPOINT || 'https://send.api.mailtrap.io/';

// Check if Mailtrap is properly configured
const isConfigured = TOKEN && TOKEN !== 'your_mailtrap_token_here' && TOKEN.trim() !== '';

let client = null;

if (isConfigured) {
  try {
    client = new MailtrapClient({
      token: TOKEN,
      endpoint: ENDPOINT,
    });
    console.log('✓ Mailtrap email service initialized');
  } catch (error) {
    console.warn('⚠ Mailtrap client initialization failed:', error.message);
  }
} else {
  console.warn('⚠ Mailtrap not configured - emails will not be sent (registration will still work)');
}

const sender = {
  email: 'noreply@towntriphub.com',
  name: 'TownTripHub',
};

module.exports = {
  client,
  sender,
  isConfigured,
};
