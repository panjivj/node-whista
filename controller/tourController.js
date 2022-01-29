const Tour = require('../models/tourModel');
const factory = require('./factoryController');
// const { saveImageToStorage } = require('../helper/utils');

exports.createTour = factory.create(Tour);
exports.deleteTour = factory.deleteById(Tour);
exports.getTour = factory.getOneById(Tour);
exports.getTours = factory.getAll(Tour);
exports.updateTour = factory.updateById(Tour);
exports.handleImageUpload = async (req, res, next) => {
  if (!req.files) return next();
  // const currentUserId = req.authUser.id;
  // Object.values(req.files).forEach((field) => {
  //   const { fieldname } = field[0];
  //   req.body[fieldname] = [];
  //   field.forEach(async (file, index) => {
  //     const imageUrl = await saveImageToStorage(file, currentUserId, index);
  //     req.body[fieldname].push(imageUrl);
  //   });
  // });
  console.log(req.files);
  // const result = req.files.map((field) => field);
  // console.log(result);
  res.end('end');
};
