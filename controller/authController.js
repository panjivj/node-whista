const User = require('../models/userModel');
const { catchAsync } = require('../helper/catchAsync');
const { filterObj, response } = require('../helper/utils');

exports.signUp = catchAsync(async (req, res, next) => {
  const filters = filterObj(req.body, 'name', 'email', 'password', 'passwordConfirm');
  const createdUser = await User.create(filters);
  response(res, createdUser, 201);
});
