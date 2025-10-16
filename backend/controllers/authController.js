const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const EmailService = require('../mailtrap/email');

function buildValidationError(res, errors) {
  return res.status(400).json({ errors: errors.array() });
}

const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return buildValidationError(res, errors);
  }

  const { name, email, password } = req.body;

  console.log('Registration attempt:', { name, email, passwordLength: password?.length });

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Email already exists:', email);
    return res.status(400).json({ message: 'Email already exists' });
  }

  try {
    const user = await User.create({ name, email, password });
    console.log('User created:', user._id);

    const verificationTokenPlain = user.generateEmailVerificationToken();
    await user.save();
    console.log('User saved with verification token');

    // Try to send email but don't fail registration if email fails
    try {
      await EmailService.sendWelcomeEmail(email, name, verificationTokenPlain);
      console.log('Welcome email sent');
    } catch (emailError) {
      console.warn('Email service failed, but registration successful:', emailError.message);
    }

    res.status(201).json({
      message: 'Registered successfully. Please verify your email.',
    });
  } catch (dbError) {
    console.error('Database error during registration:', dbError);
    return res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return buildValidationError(res, errors);

  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken({ id: user._id, role: user.role });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified } });
});

const logout = asyncHandler(async (_req, res) => {
  res.json({ message: 'Logged out' });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ message: 'Token required' });
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({ emailVerificationToken: hashed });
  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();
  res.json({ message: 'Email verified successfully' });
});

const requestPasswordReset = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return buildValidationError(res, errors);

  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(200).json({ message: 'If that email exists, a reset link was sent' });

  const resetTokenPlain = user.generatePasswordResetToken();
  await user.save();
  await EmailService.sendPasswordResetEmail(email, user.name, resetTokenPlain);
  res.json({ message: 'Password reset email sent' });
});

const resetPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return buildValidationError(res, errors);

  const { token, password } = req.body;
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({ passwordResetToken: hashed, passwordResetExpires: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json({ message: 'Password reset successful' });
});

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
};


