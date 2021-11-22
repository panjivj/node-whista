const User = require('../models/userModel');
const { catchAsync } = require('../helper/catchAsync');

exports.signUp = catchAsync(async (req, res, next) => {
  const createdUser = await User.create(req.body);
  res.status(201).json(createdUser);
});
