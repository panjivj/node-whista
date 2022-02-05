const Tour = require('../models/tourModel');
const factory = require('./factoryController');

exports.createTour = factory.create(Tour);
exports.deleteTour = factory.deleteById(Tour);
exports.getTour = factory.getOneById(Tour);
exports.getTours = factory.getAll(Tour);
exports.updateTour = factory.updateById(Tour);
exports.updateImageTour = factory.updateImage(Tour);
exports.handleUploadImageTour = factory.uploadImageToStorage;
