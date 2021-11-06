const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: 'string',
    minLength: [2, 'User name mush have more or equal then 2 characters'],
    maxLength: [100, 'User name mush have more or equal then 100 characters'],
    required: [true, 'User must have a name'],
    unique: true,
    trim: true,
  },
  email: {
    type: 'string',
    minLength: [2, 'User email mush have more or equal then 2 characters'],
    maxLength: [100, 'User email mush have more or equal then 100 characters'],
    required: [true, 'User must have a email'],
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'User mail badly formatted'],
  },
  password: {
    type: 'string',
    minLength: [8, 'User password mush have more or equal then 8 characters'],
    maxLength: [100, 'User password mush have more or equal then 100 characters'],
    required: [true, 'User must have a password'],
    trim: true,
  },
  passwordConfirm: {
    type: 'string',
    minLength: [8, 'User passwordConfirm mush have more or equal then 8 characters'],
    maxLength: [100, 'User passwordConfirm mush have more or equal then 100 characters'],
    required: [true, 'User must have a passwordConfirm'],
    trim: true,
  },
  role: {
    type: 'string',
    minLength: [2, 'User role mush have more or equal then 8 characters'],
    maxLength: [100, 'User role mush have more or equal then 100 characters'],
    required: [true, 'User must have a role'],
    trim: true,
  },
  photoProfile: {
    type: 'string',
    maxLength: 1000,
    trim: true,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
