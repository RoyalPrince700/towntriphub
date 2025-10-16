require('dotenv').config();
const emailService = require('./mailtrap/email');

// Test function to verify Mailtrap configuration
async function testMailtrap() {
  console.log('🔍 Testing Mailtrap configuration...\n');

  try {
    // Check if environment variables are loaded
    console.log('📋 Environment Variables:');
    console.log(`MAILTRAP_TOKEN: ${process.env.MAILTRAP_TOKEN ? '✅ Set' : '❌ Not set'}`);
    console.log(`MAILTRAP_ENDPOINT: ${process.env.MAILTRAP_ENDPOINT || 'Using default'}\n`);

    // Test sending a simple email
    console.log('📧 Sending test email...');

    // For testing, we'll send to a dummy email that will be caught by Mailtrap
    await emailService.sendWelcomeEmail(
      'test@example.com',
      'Test User',
      'test-verification-token-12345'
    );

    console.log('✅ Test email sent successfully!');
    console.log('📬 Check your Mailtrap inbox to see the test email.');
    console.log('🔗 Login to https://mailtrap.io/inboxes to view the email.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure your .env file has the correct MAILTRAP_TOKEN');
    console.log('2. Verify your token is active in Mailtrap dashboard');
    console.log('3. Check your internet connection');
    console.log('4. Ensure the mailtrap package is installed: npm install');
  }
}

// Run the test
testMailtrap();
