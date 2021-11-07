const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [2, 'User name mush have more or equal then 2 characters'],
    maxLength: [100, 'User name mush have more or equal then 100 characters'],
    required: [true, 'User must have a name'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    minLength: [2, 'User email mush have more or equal then 2 characters'],
    maxLength: [100, 'User email mush have more or equal then 100 characters'],
    required: [true, 'User must have a email'],
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'User mail badly formatted'],
  },
  password: {
    type: String,
    minLength: [8, 'User password mush have more or equal then 8 characters'],
    maxLength: [100, 'User password mush have more or equal then 100 characters'],
    required: [true, 'User must have a password'],
    trim: true,
    select: false,
  },
  passwordConfirm: {
    type: String,
    minLength: [8, 'User passwordConfirm mush have more or equal then 8 characters'],
    maxLength: [100, 'User passwordConfirm mush have more or equal then 100 characters'],
    required: [true, 'User must have a passwordConfirm'],
    trim: true,
    select: false,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'password and passwordConfirm must be the same',
    },
  },
  role: {
    type: String,
    minLength: [2, 'User role mush have more or equal then 8 characters'],
    maxLength: [100, 'User role mush have more or equal then 100 characters'],
    required: [true, 'User must have a role'],
    trim: true,
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
});

const User = mongoose.model('User', userSchema);
module.exports = User;