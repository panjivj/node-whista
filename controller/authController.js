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

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError('Please provide name and password', 400));

  const foundUser = await User.findOne({ email: email }).select('+password');
  if (!foundUser || !(await foundUser.examinePassword(password, foundUser.password)))
    return next(new AppError('Incorrect email or password', 401));

  const token = issueToken(foundUser.id);
  response(res, { token: token }, 200);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return next(new AppError('Token empty or use bearer token', 400));

  const decoded = await decodedToken(token);

  const checkUserExist = await User.findById(decoded.id);
  if (!checkUserExist) return next(new AppError('User not exist', 400));

  req.user = checkUserExist;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission', 403));
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {});
