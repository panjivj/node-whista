const Tour = require('../models/tourModel');
const factory = require('./factoryController');
const { saveImageToStorage } = require('../helper/utils');

exports.createTour = factory.create(Tour);
exports.deleteTour = factory.deleteById(Tour);
exports.getTour = factory.getOneById(Tour);
exports.getTours = factory.getAll(Tour);
exports.updateTour = factory.updateById(Tour);
exports.handleImageUpload = async (req, res, next) => {
  console.log('start');
  if (!req.files) return next();
  const currentUserId = req.authUser.id;

  // Object.values(req.files).forEach((field) => {
  //   const { fieldname } = field[0];
  //   req.body[fieldname] = [];
  //   field.forEach(async (file, index) => {
  //     const imageUrl = await saveImageToStorage(file, currentUserId, index);
  //     req.body[fieldname].push(imageUrl);
  //   });
  // });
  // const result = (() =>
  //   new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve('halloo');
  //     }, req.body.time * 1);
  //   }))();

  // const result = (files, userId) =>
  //   new Promise((resolve) => {
  //     Object.values(files).forEach(async (field) => {
  //       field.forEach(async (file, index) => {
  //         const imageUrl = await saveImageToStorage(file, userId, index);
  //         resolve(imageUrl);
  //       });
  //     });
  //   });
  // console.log(await result(req.files, currentUserId));

  const photos = req.files.imagePhotos;

  const all = () =>
    Promise.all(
      photos.map(
        async (file, index) =>
          await saveImageToStorage(file, '61c37a2659d469bcdc271d05', index),
      ),
    );

  const result = await all();

  console.log(result);

  console.log('end');
  res.end('end');
};
