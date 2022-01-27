const mongoose = require('mongoose');
const User = require('../models/userModel');
const RefreshToken = require('../models/refreshTokenModel');
const { catchAsync, catchAsyncFinally } = require('../helper/catchAsync');
const { filterObj, response, createHashHex } = require('../helper/utils');
const {
  issueAccessToken,
  decodedAccessToken,
  issueRefreshToken,
  decodedRefreshToken,
  responseAuth,
  responseRefreshFail,
} = require('../helper/jwt');
const AppError = require('../helper/AppError');
const { sendEmail } = require('../helper/configs');

exports.signUp = catchAsyncFinally(async (req, res, next) => {
  const session = await mongoose.startSession();
  res.fnFinally = async () => await session.endSession();

  await session.withTransaction(async () => {
    const filters = filterObj(req.body, 'name', 'email', 'password', 'passwordConfirm');
    const createdUser = await User.create([filters], { session: session });

    const access = issueAccessToken(createdUser[0].id);
    const refresh = issueRefreshToken(createdUser[0].id);

    const timeInS = Date.now() + process.env.REFRESH_JWT_EXPIRES_IN * 1;
    const objSave = {
      user: createdUser[0].id,
      token: refresh,
      expireAt: timeInS,
    };
    await RefreshToken.create(objSave);
    responseAuth(res, access, refresh, 200);
  });
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
  const newRefreshToken = issueRefreshToken(currentUser.id);

  const timeInS = Date.now() + process.env.REFRESH_JWT_EXPIRES_IN * 1;
  const objSave = {
    user: currentUser.id,
    token: newRefreshToken,
    expireAt: timeInS,
  };
  await RefreshToken.create(objSave);
  responseAuth(res, accessToken, newRefreshToken, 200);
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
    if (!roles.includes(req.authUser.role)) {
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
    response(res, { message: 'Reset token has been sent to email' }, 200);
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
    return responseRefreshFail(res, { message: 'Please use your credentials' }, 204);
  }
  const refreshToken = req.headers.cookie.substring(8);
  const decodedRefresh = await decodedRefreshToken(refreshToken);
  const checkRefreshToken = await RefreshToken.findOne(
    { token: refreshToken },
    { user: 1 },
  );
  if (!checkRefreshToken)
    return responseRefreshFail(res, { message: 'Invalid token, please re-login' }, 204);

  const checkUser = decodedRefresh.id === checkRefreshToken.user.valueOf();

  if (!checkUser)
    return responseRefreshFail(res, { message: 'User does not exist' }, 204);

  const newAccessToken = issueAccessToken(decodedRefresh.id);
  response(res, { token: newAccessToken }, 200);
});
