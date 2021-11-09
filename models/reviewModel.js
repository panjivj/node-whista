const mongoose = require('mongoose');
const tourModel = require('./tourModel');
const userModel = require('./userModel');

const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: [2, 'Review title mush have more or equal then 2 characters'],
    maxLength: [100, 'Review title mush have more or equal then 50 characters'],
    required: [true, 'Review must have a title'],
  },
  content: {
    type: String,
    minLength: [2, 'Review content mush have more or equal then 2 characters'],
    maxLength: [500, 'Review content mush have more or equal then 500 characters'],
    required: [true, 'Review must have a content'],
  },
  rating: {
    type: Number,
    minLength: [1, 'Review content mush have more or equal then 1 characters'],
    maxLength: [5, 'Review content mush have more or equal then 5 characters'],
    required: [true, 'Review must have a rating'],
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Review must have a tour'],
    validate: {
      // check tour exist or not
      validator: function (el) {
        return tourModel.exists({ _id: el });
      },
      message: 'Tour ID not found ',
    },
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must have a user'],
    validate: {
      // check user exist or not
      validator: function (el) {
        return userModel.exists({ _id: el });
      },
      message: 'User ID not found ',
    },
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
