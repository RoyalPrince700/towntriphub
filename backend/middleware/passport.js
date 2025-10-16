const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleTokenStrategy = require('passport-google-id-token');
const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const { Strategy: GoogleOAuthStrategy } = require('passport-google-oauth20');

// Local email/password strategy
passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password', session: false },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) return done(null, false, { message: 'Invalid credentials' });
        const match = await user.matchPassword(password);
        if (!match) return done(null, false, { message: 'Invalid credentials' });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Google ID token strategy (works with GIS id_token)
passport.use(
  new GoogleTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
    },
    async (parsedToken, googleId, done) => {
      try {
        const { email, name, picture } = parsedToken.payload || {};
        if (!email) return done(null, false, { message: 'Email not present in token' });

        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({ name, email, googleId, isEmailVerified: true, avatarUrl: picture });
        } else if (!user.googleId) {
          user.googleId = googleId;
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// No sessions; serialize/deserialize stubs for completeness
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Google OAuth 2.0 redirect-based strategy (authorization code)
passport.use(
  new GoogleOAuthStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = (profile.emails && profile.emails[0] && profile.emails[0].value) || null;
        const name = profile.displayName || 'User';
        const picture = (profile.photos && profile.photos[0] && profile.photos[0].value) || undefined;
        if (!email) return done(null, false, { message: 'Email not available from Google profile' });

        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({ name, email, googleId: profile.id, isEmailVerified: true, avatarUrl: picture });
        } else if (!user.googleId) {
          user.googleId = profile.id;
          if (!user.avatarUrl && picture) user.avatarUrl = picture;
          await user.save();
        }

        const token = signToken({ id: user._id, role: user.role });
        return done(null, { user, token });
      } catch (err) {
        return done(err);
      }
    }
  )
);

module.exports = passport;



