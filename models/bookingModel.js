const mongoose = require('mongoose');
const validator = require('validator');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: {
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
        minlength: [10, 'A tour summary must have more or equal then 10 characters '],
      },
      description: {
        type: String,
        required: [true, 'A tour must have description'],
        trim: true,
        maxlength: [
          10000,
          'A tour description must have less or equal then 10000 characters',
        ],
        minlength: [10, 'A tour description must have more or equal then 10 characters '],
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
        maxlength: [
          500,
          'A tour departure details must have less or equal then 500 characters',
        ],
        minlength: [
          10,
          'A tour departure details must have more or equal then 10 characters ',
        ],
      },
      returnDetails: {
        type: String,
        maxlength: [
          500,
          'A tour return details must have less or equal then 500 characters',
        ],
        minlength: [
          10,
          'A tour return details must have more or equal then 10 characters ',
        ],
      },
      maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have max group size'],
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
    },
  },
  user: {
    type: {
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
      role: {
        type: String,
        enum: ['user', 'guide', 'admin'],
        default: 'user',
        required: [true, 'User must have a role'],
      },
    },
  },
  pricePaid: {
    type: Number,
    required: [true, 'A tour must have price'],
    min: [1, 'price must be have less or equal 1'],
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paymentMethod: {
    type: String,
    required: [true, 'A Booker must have paymentMethod'],
  },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
