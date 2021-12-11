const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const issueAccessToken = (id) =>
  jwt.sign({ id }, process.env.ACCESS_JWT_SECRET, {
    expiresIn: process.env.ACCESS_JWT_EXPIRES_IN,
  });

const issueRefreshToken = (id) =>
  jwt.sign({ id }, process.env.REFRESH_JWT_SECRET, {
    expiresIn: process.env.REFRESH_JWT_EXPIRES_IN,
  });

const decodedAccessToken = async (token) =>
  promisify(jwt.verify)(token, process.env.ACCESS_JWT_SECRET);

const decodedRefreshToken = async (token) =>
  promisify(jwt.verify)(token, process.env.REFRESH_JWT_SECRET);

const responseAuth = (res, accessToken, refreshToken, statusCode) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.REFRESH_JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    secure: true,
    httpOnly: true,
  };

  res.cookie('refresh', refreshToken, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    content: {
      token: accessToken,
    },
  });
};

module.exports = {
  issueAccessToken,
  decodedAccessToken,
  issueRefreshToken,
  decodedRefreshToken,
  responseAuth,
};
