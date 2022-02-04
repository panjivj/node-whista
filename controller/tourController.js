const Tour = require('../models/tourModel');
const factory = require('./factoryController');
const { saveImageToStorage } = require('../helper/utils');

exports.createTour = factory.create(Tour);
exports.deleteTour = factory.deleteById(Tour);
exports.getTour = factory.getOneById(Tour);
exports.getTours = factory.getAll(Tour);
exports.updateTour = factory.updateById(Tour);
exports.updateImageTour = factory.updateImage(Tour);
exports.handleImageUpload = async (req, res, next) => {
  if (!req.files) return next();
  const imageName = req.body.name;

  const uploadAndGetUrl = (field, userId) =>
    Promise.all(field.map(async (file) => await saveImageToStorage(file, userId)));

  const getFieldnameAndUrl = () =>
    Promise.all(
      Object.values(req.files).map(async (currentFields) => {
        const url = await uploadAndGetUrl(currentFields, imageName);
        const object = {};
        object[currentFields[0].fieldname] = url;
        // console.log(object);
        return object;
      }),
    );

  const resultUpload = await getFieldnameAndUrl();

  resultUpload.forEach((fieldname) => {
    Object.assign(req.body, fieldname);
  });

  next();
};
