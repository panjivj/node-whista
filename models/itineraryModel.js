const mongoose = require('mongoose');
const tourModel = require('./tourModel');

const itinerarySchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Itinerary must have a tour'],
    validate: {
      // check tour exist or not
      validator: function (el) {
        return tourModel.exists({ _id: el });
      },
      message: 'Tour ID not found ',
    },
  },
  itinerary: [
    {
      title: {
        type: String,
        required: [true, 'Itinerary must have title'],
        trim: true,
        maxlength: [100, 'A title must have less or equal then 300 characters'],
        minlength: [2, 'A title  must have more or equal then 10 characters '],
      },
      timetable: [
        {
          title: {
            type: String,
            required: [true, 'Timetable must have title'],
            trim: true,
            maxlength: [100, 'A Timetable must have less or equal then 300 characters'],
            minlength: [2, 'A Timetable  must have more or equal then 10 characters '],
          },
          duration: {
            type: Number,
            required: [true, 'Timetable must have title'],
            trim: true,
            min: [1, 'Timetable must above 1'],
            max: [1440, 'Timetable must below 1440'],
          },
          admissionIncluded: {
            type: Boolean,
            default: true,
          },
        },
      ],
    },
  ],
});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
module.exports = Itinerary;
