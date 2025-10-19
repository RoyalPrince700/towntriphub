const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mongoosePaginate = require('mongoose-paginate-v2');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      minlength: 2,
      maxlength: 60,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please add a valid email'],
    },
    password: {
      type: String,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'driver', 'logistics', 'admin'],
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    googleId: {
      type: String,
      sparse: true,
    },
    avatarUrl: String,
  },
  { timestamps: true }
);

UserSchema.pre('save', async function hashPasswordIfModified(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function matchPassword(enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.generateEmailVerificationToken = function generateEmailVerificationToken() {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  return verificationToken;
};

UserSchema.methods.generatePasswordResetToken = function generatePasswordResetToken() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  return resetToken;
};

// Create a unique sparse index for googleId to allow multiple null values
// This allows manual registration users (without googleId) to coexist
UserSchema.index({ googleId: 1 }, { unique: true, sparse: true });

// Apply pagination plugin
UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', UserSchema);


