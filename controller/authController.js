const User = require('../models/userModel');
const { catchAsync } = require('../helper/catchAsync');
const {
  filterObj,
  filterRemoveObj,
  response,
  createHashHex,
} = require('../helper/utils');
const {
  issueAccessToken,
  decodedAccessToken,
  issueRefreshToken,
  // decodedRefreshToken,
  responseAuth,
} = require('../helper/jwt');
const AppError = require('../helper/AppError');
const { sendEmail } = require('../helper/email');

exports.signUp = catchAsync(async (req, res, next) => {
  const filters = filterObj(req.body, 'name', 'email', 'password', 'passwordConfirm');
  const createdUser = await User.create(filters);
  const filtersRemove = filterRemoveObj(
    createdUser.toObject(),
    'password',
    'passwordConfirm',
  );
  const token = issueAccessToken(filtersRemove._id);
  filtersRemove.token = token;
  response(res, filtersRemove, 201);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError('Please provide name and password', 400));

  const foundUser = await User.findOne({ email }).select('+password');
  if (!foundUser || !(await foundUser.examinePassword(password, foundUser.password)))
    return next(new AppError('Incorrect email or password', 401));

  const accessToken = issueAccessToken(foundUser.id);
  const refreshToken = issueRefreshToken(foundUser.id);

  responseAuth(res, accessToken, refreshToken, 200);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token)
    return next(
      new AppError(
        'You are trying to request protected content! please use your credentials',
        403,
      ),
    );

  const decoded = await decodedAccessToken(token);

  const checkUserExist = await User.findById(decoded.id);
  if (!checkUserExist) return next(new AppError('User not exist', 400));

  if (!checkUserExist.isTokenIssuedAfterPasswordChange(decoded.iat))
    return next(new AppError('User recently changed password, Please relogin', 401));

  req.authUser = checkUserExist;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You don't have access permission", 403));
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError('Please provide email', 400));

  const foundUser = await User.findOne({ email });
  if (!foundUser) return next(new AppError('User does not exist', 400));

  const resetToken = foundUser.generatePasswordResetToken();
  await foundUser.save();

  const resetURL = `${req.protocol}://${req.get('host')}${
    process.env.API_VERSION
  }/users/resetPassword/${resetToken}`;

  try {
    await sendEmail({
      email: email,
      subject: 'Password reset token (valid for 10 min)',
      message: `Submit a PATCH request with your new password and passwordConfirm to ${resetURL}`,
    });
    response(res, { message: 'Token send to email' }, 200);
  } catch (error) {
    foundUser.passwordResetToken = undefined;
    foundUser.passwordResetExpires = undefined;
    await foundUser.save();

    return next(new AppError('There was an error sending the email', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;
  if (!password || !passwordConfirm)
    return next('Please provide email and password', 400);

  const getHashedToken = createHashHex('sha256', req.params.token);
  const foundUser = await User.findOne({
    passwordResetToken: getHashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!foundUser) return next(new AppError('Token invalid or expired', 400));

  foundUser.password = password;
  foundUser.passwordConfirm = passwordConfirm;
  await foundUser.save();

  response(res, { token: issueAccessToken(foundUser.id) }, 200);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const foundUser = await User.findById(req.authUser.id).select('+password');
  if (!foundUser) return next(new AppError('User not found'));

  if (!(await foundUser.examinePassword(req.body.passwordCurrent, foundUser.password)))
    return next(new AppError('Your current password is wrong'), 400);

  foundUser.password = req.body.password;
  foundUser.passwordConfirm = req.body.passwordConfirm;
  await foundUser.save();

  response(res, { message: 'The password has been updated' }, 200);
});
