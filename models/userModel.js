const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { createHashHex } = require('../helper/utils');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [2, 'User name mush have more or equal then 2 characters'],
    maxLength: [100, 'User name mush have more or equal then 100 characters'],
    required: [true, 'User must have a name'],
    trim: true,
  },
  email: {
    type: String,
    minLength: [2, 'User email mush have more or equal then 2 characters'],
    maxLength: [100, 'User email mush have more or equal then 100 characters'],
    required: [true, 'User must have a email'],
    trim: true,
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, 'User mail badly formatted'],
  },
  password: {
    type: String,
    minLength: [4, 'User password mush have more or equal then 4 characters'],
    maxLength: [100, 'User password mush have more or equal then 100 characters'],
    required: [true, 'User must have a password'],
    trim: true,
    select: false,
  },
  passwordConfirm: {
    type: String,
    minLength: [4, 'User passwordConfirm mush have more or equal then 4 characters'],
    maxLength: [100, 'User passwordConfirm mush have more or equal then 100 characters'],
    required: [true, 'User must have a passwordConfirm'],
    trim: true,
    select: false,
    validate: {
      // only works on CREATE and SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: 'password and passwordConfirm must be the same',
    },
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'admin'],
    default: 'user',
    required: [true, 'User must have a role'],
  },
  photoProfile: {
    type: String,
    maxLength: 1000,
    trim: true,
  },
  status: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangedAt: Date,
  refreshToken: {
    type: [
      {
        token: {
          type: String,
          required: [true, 'RefreshToken must have token value'],
          trim: true,
          maxlength: [500, 'RefreshToken must have less or equal then 300 characters'],
          minlength: [500, 'RefreshToken must have less or equal then 10 characters'],
        },
        expireAt: { type: Date, default: new Date() },
      },
    ],
    index: true,
  },
});

userSchema.index({ refreshToken: { expireAt: 1 } }, { expireAfterSeconds: 30 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.examinePassword = async function (newPassword, oldPassword) {
  return await bcrypt.compare(newPassword, oldPassword);
};

userSchema.methods.generatePasswordResetToken = function () {
  // generate random string and hash it
  const resetToken = crypto.randomBytes(32).toString('hex');
  const encryptResetToken = createHashHex('sha256', resetToken);

  this.passwordResetToken = encryptResetToken;
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.isTokenIssuedAfterPasswordChange = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    return JWTTimestamp > this.passwordChangedAt.getTime() / 1000;
  }
  return true;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
