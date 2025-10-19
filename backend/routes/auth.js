const express = require('express');
const { body, query } = require('express-validator');
const passport = require('../middleware/passport');
const { protect } = require('../middleware/auth');
const { signToken } = require('../utils/jwt');
const {
  register,
  login,
  logout,
  verifyEmail,
  getProfile,
  requestPasswordReset,
  resetPassword,
} = require('../controllers/authController');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').isString().isLength({ min: 2 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
  ],
  register
);

router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').isString().isLength({ min: 8 })],
  login
);

router.post('/logout', logout);

router.get('/profile', protect, getProfile);

router.get('/verify-email', [query('token').isString()], verifyEmail);

router.post('/password/forgot', [body('email').isEmail().normalizeEmail()], requestPasswordReset);

router.post('/password/reset', [body('token').isString(), body('password').isLength({ min: 8 })], resetPassword);



// Redirect-based Google OAuth 2.0
router.get('/google/redirect',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, payload) => {
    if (err) return next(err);
    if (!payload) return res.status(401).send('Google authentication failed');
    const { token, user } = payload;
    // Redirect back to frontend with token in query string
    const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUrl = `${frontend}/auth/callback?token=${encodeURIComponent(token)}`;
    return res.redirect(302, redirectUrl);
  })(req, res, next);
});

module.exports = router;


