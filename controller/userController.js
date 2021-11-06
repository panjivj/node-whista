const User = require('../models/userModel');
const factory = require('./factoryController');
const { catchAsync } = require('../helper/catchAsync');

exports.createUser = factory.create(User);
exports.deleteUser = factory.deleteById(User);
exports.getUser = factory.getOneById(User);

const filterObj = (obj) => {
  Object.keys(obj).forEach((el) => {
    console.log(el);
  });
};

exports.updateUser = catchAsync(async (req, res, next) => {
  filterObj(req.body);
  res.status(200).json('OK');
});
