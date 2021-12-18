const mongoose = require('mongoose');
const userModel = require('./userModel');

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: [true, 'Token must have token value'],
    trim: true,
    maxlength: [350, 'Token must have less or equal then 350 characters'],
    minlength: [10, 'Token must have less or equal then 10 characters'],
  },
  expireAt: { type: Date, required: [true, 'Token must have a expireAt'] },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Token must have a user'],
    validate: {
      // check user exist or not
      validator: function (el) {
        return userModel.exists({ _id: el });
      },
      message: 'User ID not found ',
    },
  },
});

refreshTokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

module.exports = RefreshToken;

// I want to know if it's possible to use TTL on nested documents. ?
// That is currently not possible with TTL index.
// Mongo will remove the whole document after a specified
// number of seconds or at a specific clock time.
