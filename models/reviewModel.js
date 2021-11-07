const mongoose = require('mongoose');

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
    type: String,
    minLength: [2, 'Review tour mush have more or equal then 2 characters'],
    maxLength: [100, 'Review tour mush have more or equal then 100 characters'],
    required: [true, 'Review must have a tour'],
  },
  user: {
    type: String,
    minLength: [2, 'Review user mush have more or equal then 2 characters'],
    maxLength: [100, 'Review user mush have more or equal then 100 characters'],
    required: [true, 'Review must have a user'],
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
