const User = require('../models/userModel');
const factory = require('./factoryController');
const { catchAsync } = require('../helper/catchAsync');
const AppError = require('../helper/AppError');
// const { response } = require('./factoryController');

exports.createUser = factory.create(User);
exports.deleteUser = factory.deleteById(User);
exports.getUser = factory.getOneById(User);

// take the field that only wanted
const filterObj = (obj, ...allowed) => {
  // allowed became array []
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowed.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

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
  const doc = await User.findByIdAndUpdate(req.params.id, filters, {
    new: true,
    runValidators: true,
  });

  factory.res(res, doc, 200);
});
