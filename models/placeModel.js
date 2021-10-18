const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A place must have a name'],
    unique: true,
    trim: true,
    maxlength: [48, 'A place name must have less or equal then 48 characters'],
    minlength: [8, 'A place name must have more or equal then 8 charaters'],
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'A place must have a description'],
  },
  coordinates: [Number],
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  editedAt: {
    type: Date,
    default: Date.now(),
  },
});

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
