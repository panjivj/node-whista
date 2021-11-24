const User = require('../models/userModel');
const { catchAsync } = require('../helper/catchAsync');
const { filterObj, filterRemoveObj, response } = require('../helper/utils');
const { issueToken } = require('../helper/jwt');

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
