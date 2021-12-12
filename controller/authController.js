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
  decodedRefreshToken,
  responseAuth,
} = require('../helper/jwt');
const AppError = require('../helper/AppError');
const { sendEmail } = require('../helper/configs');

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

  const currentUser = await User.findOne({ email }).select('+password');
  if (
    !currentUser ||
    !(await currentUser.examinePassword(password, currentUser.password))
  )
    return next(new AppError('Incorrect email or password', 401));

  const accessToken = issueAccessToken(currentUser.id);
  const refreshToken = issueRefreshToken(currentUser.id);
  const token = {
    token: refreshToken,
  };
  await User.findByIdAndUpdate(currentUser.id, {
    $addToSet: { refreshToken: token },
  });
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

  const currentUser = await User.findOne({ email });
  if (!currentUser) return next(new AppError('User does not exist', 400));

  const resetToken = currentUser.generatePasswordResetToken();
  await currentUser.save();

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
    currentUser.passwordResetToken = undefined;
    currentUser.passwordResetExpires = undefined;
    await currentUser.save();

    return next(new AppError('There was an error sending the email', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;
  if (!password || !passwordConfirm)
    return next('Please provide email and password', 400);

  const getHashedToken = createHashHex('sha256', req.params.token);
  const currentUser = await User.findOne({
    passwordResetToken: getHashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!currentUser) return next(new AppError('Token invalid or expired', 400));

  currentUser.password = password;
  currentUser.passwordConfirm = passwordConfirm;
  await currentUser.save();

  response(res, { token: issueAccessToken(currentUser.id) }, 200);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const currentUser = await User.findById(req.authUser.id).select('+password');
  if (!currentUser) return next(new AppError('User not found', 400));

  if (
    !(await currentUser.examinePassword(req.body.passwordCurrent, currentUser.password))
  )
    return next(new AppError('Your current password is wrong'), 400);

  currentUser.password = req.body.password;
  currentUser.passwordConfirm = req.body.passwordConfirm;
  await currentUser.save();

  response(res, { message: 'The password has been updated' }, 200);
});

exports.refresh = catchAsync(async (req, res, next) => {
  if (!req.headers.cookie || !req.headers.cookie.startsWith('refresh=')) {
    return next(new AppError('Please use your credentials cookie', 401));
  }
  const refreshToken = req.headers.cookie.substring(8);
  const decodedRefresh = await decodedRefreshToken(refreshToken);
  // const foundToken = await User.findById(decodedRefresh.id);

  const newAccessToken = issueAccessToken(decodedRefresh.id);
  response(res, { token: newAccessToken }, 200);
});
