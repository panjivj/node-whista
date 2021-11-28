// const { promisify } = require('util');
const User = require('../models/userModel');
const { catchAsync } = require('../helper/catchAsync');
const { filterObj, filterRemoveObj, response } = require('../helper/utils');
const { issueToken, decodedToken } = require('../helper/jwt');
const AppError = require('../helper/AppError');

exports.signUp = catchAsync(async (req, res, next) => {
  const filters = filterObj(req.body, 'name', 'email', 'password', 'passwordConfirm');
  const createdUser = await User.create(filters);
  const filtersRemove = filterRemoveObj(
    createdUser.toObject(),
    'password',
    'passwordConfirm',
  );
  const token = issueToken(filtersRemove._id);
  filtersRemove.token = token;
  response(res, filtersRemove, 201);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return next(new AppError('Token empty or use bearer token', 403));

  const decoded = await decodedToken(token);
  console.log(decoded);
  res.end('end');
});
