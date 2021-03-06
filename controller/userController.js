const User = require('../models/userModel');
const factory = require('./factoryController');
const { catchAsync } = require('../helper/catchAsync');
const AppError = require('../helper/AppError');
const { filterObj, response } = require('../helper/utils');

exports.createUser = factory.create(User);
exports.deleteUser = factory.deleteById(User);

exports.getUser = catchAsync(async (req, res, next) => {
  const foundUser = await User.findById(req.authUser.id);
  if (!foundUser) return next(new AppError('User does not exist', 400));
  response(res, foundUser, 200);
});

exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'This route is not for password update, Please remove password & password confirm field',
        400,
      ),
    );

  // only update field name and email
  const filters = filterObj(req.body, 'name', 'email');
  const doc = await User.findByIdAndUpdate(req.authUser.id, filters, {
    new: true,
    runValidators: true,
  });

  response(res, doc, 200);
});
