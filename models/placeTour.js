const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [150, 'A tour name must have less or equal then 48 characters'],
    minlength: [10, 'A tour name must have more or equal then 8 charaters'],
  },
  summary: {
    type: String,
    required: [true, 'A tour mus have a summary'],
    trim: true,
    maxlength: [300, 'A tour summary must have less or equal then 300 characters'],
    minlength: [10, 'A tour summary must have more or equal then 8 characters '],
  },
  description: {
    type: String,
    required: [true, 'A tour must have descriptions'],
    trim: true,
    maxlength: [10000, 'A tour summary must have less or equal then 10000 characters'],
    minlength: [10, 'A tour summary must have more or equal then 10 characters '],
  },
  imageThumbnail: {
    type: String,
    required: [true, 'A tour must have imageThumbnail'],
  },
  startDate: {
    type: Date,
    required: [true, 'A tour must have startDate'],
  },
  endDate: {
    type: Date,
    required: [true, 'A tour must have endDate'],
  },
  additionalInformation: {
    type: [String],
  },
  inclusions: {
    type: [String],
  },
  exclusions: {
    type: [String],
  },
  departureDetails: {
    type: String,
    maxlength: [500, 'A tour summary must have less or equal then 500 characters'],
    minlength: [10, 'A tour summary must have more or equal then 10 characters '],
  },
  returnDetails: {
    type: String,
    maxlength: [500, 'A tour summary must have less or equal then 500 characters'],
    minlength: [10, 'A tour summary must have more or equal then 10 characters '],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have number'],
    min: [1, 'max group size must be have less or equal 1'],
  },
  price: {
    type: Number,
    required: [true, 'A tour must have price'],
    min: [1, 'price must be have less or equal 1'],
  },
  priceDiscount: {
    type: Number,
    min: [1, 'price must be have less or equal 1'],
  },
  imagePhotos: {
    type: [String],
  },
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
