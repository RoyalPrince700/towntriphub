# SMS OTP Integration Guide with Hi-Send

This guide outlines the steps to integrate SMS OTP verification using Hi-Send into your existing authentication system in **TownTripHub**. This is designed for users who prefer using their phone numbers for registration and login.

## Overview
Hi-Send provides a RESTful API for sending and validating OTPs. We will integrate it into the backend to handle phone verification and add corresponding UI components to the frontend.

---

## 1. Prerequisites
- **Hi-Send Account**: Sign up at [hisend.hunnovate.com](https://hisend.hunnovate.com).
- **API Key**: Obtain your API key from the Hi-Send Dashboard.
- **Wallet Credits**: Ensure your Hi-Send wallet is funded (SMS costs ~10 credits per message).

---

## 2. Environment Configuration
Add your Hi-Send API Key to your `.env` file in the `backend` directory.

```env
HISEND_API_KEY=your_actual_api_key_here
HISEND_BASE_URL=https://core.hisend.hunnovate.com/api/v1
```

Install the `axios` package in your backend:
```bash
cd backend
npm install axios
```

---

## 3. Backend Implementation

### A. Create OTP Service Utility
Create a utility to handle API calls to Hi-Send.

**File:** `backend/utils/otpService.js` (Create this file)
```javascript
const axios = require('axios');

const HISEND_API_KEY = process.env.HISEND_API_KEY;
const BASE_URL = process.env.HISEND_BASE_URL;

const sendOTP = async (phoneNumber) => {
  try {
    const response = await axios.get(`${BASE_URL}/otp/send`, {
      params: {
        customer_identifier: phoneNumber,
        channel: 'sms',
        api_key: HISEND_API_KEY,
        length: 6, // default is 6
        expiry: 5   // default is 5 mins
      }
    });
    return response.data; // Should contain the reference
  } catch (error) {
    console.error('Hi-Send Send OTP Error:', error.response?.data || error.message);
    throw new Error('Failed to send SMS OTP');
  }
};

const verifyOTP = async (reference, otp) => {
  try {
    const response = await axios.get(`${BASE_URL}/otp/validate`, {
      params: {
        reference: reference,
        otp: otp,
        api_key: HISEND_API_KEY
      }
    });
    return response.data; // Success if OTP matches
  } catch (error) {
    console.error('Hi-Send Verify OTP Error:', error.response?.data || error.message);
    throw new Error('Invalid or expired OTP');
  }
};

module.exports = { sendOTP, verifyOTP };
```

### B. Update `authController.js`
Add methods to handle OTP requests.

**File:** `backend/controllers/authController.js`
```javascript
const { sendOTP, verifyOTP } = require('../utils/otpService');

// @desc    Send OTP to phone
// @route   POST /api/auth/send-otp
export const requestOTP = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) return res.status(400).json({ message: 'Phone number is required' });

  const data = await sendOTP(phoneNumber);
  // Store the reference in session or return to frontend to be sent back during verification
  res.status(200).json({ 
    message: 'OTP sent successfully', 
    otpReference: data.data.reference 
  });
});

// @desc    Verify OTP and complete action (Register/Login)
// @route   POST /api/auth/verify-otp
export const completeOTPVerification = asyncHandler(async (req, res) => {
  const { phoneNumber, otp, otpReference } = req.body;
  
  await verifyOTP(otpReference, otp);

  // If verification successful, find or create user
  let user = await User.findOne({ phoneNumber });
  
  if (!user) {
    // Handle new user registration logic if needed
    // user = await User.create({ phoneNumber, ... });
  }

  const token = signToken({ id: user._id, role: user.role });
  res.status(200).json({
    message: 'Verification successful',
    token,
    user: { id: user._id, name: user.name, phoneNumber: user.phoneNumber }
  });
});
```

---

## 4. Frontend Implementation

### A. Update Forms
Modify your Registration and Login components to include a phone number field.

### B. OTP Verification UI
1. User enters phone number and clicks "Send OTP".
2. Store the `otpReference` returned from the backend.
3. Show an input field for the 6-digit code.
4. User enters code and clicks "Verify".
5. On success, store the JWT token and redirect to the dashboard.

---

## 5. Summary of API Endpoints
| Action | Method | Endpoint | Parameters |
| --- | --- | --- | --- |
| **Send OTP** | `POST` | `/api/auth/send-otp` | `{ phoneNumber }` |
| **Verify OTP** | `POST` | `/api/auth/verify-otp` | `{ phoneNumber, otp, otpReference }` |

---

## Important Notes
- **Nigeria Only**: Note that Hi-Send SMS service is currently optimized for Nigeria.
- **Costs**: Monitor your credit balance on the Hi-Send dashboard.
- **Security**: Never expose your `HISEND_API_KEY` in the frontend code. Always proxy calls through your backend.
