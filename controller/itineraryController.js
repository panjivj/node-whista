const Itinerary = require('../models/itineraryModel');
const factory = require('./factoryController');

exports.createItinerary = factory.create(Itinerary);
exports.deleteItinerary = factory.deleteById(Itinerary);
exports.getItinerary = factory.getOneById(Itinerary);
