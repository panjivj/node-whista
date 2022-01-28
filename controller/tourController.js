const Tour = require('../models/tourModel');
const factory = require('./factoryController');
const { saveImageToStorage } = require('../helper/utils');

exports.createTour = factory.create(Tour);
exports.deleteTour = factory.deleteById(Tour);
exports.getTour = factory.getOneById(Tour);
exports.getTours = factory.getAll(Tour);
exports.updateTour = factory.updateById(Tour);
exports.handleImageUpload = (req, res, next) => {
  if (!req.files) return next();

  Object.values(req.files).forEach((field) => {
    field.forEach(async (file) => {
      const imageUrl = await saveImageToStorage(file);
      console.log(imageUrl);
    });
  });
  res.end('end');
};
