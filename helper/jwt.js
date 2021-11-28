const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const issueToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const decodedToken = async (token) =>
  promisify(jwt.verify)(token, process.env.JWT_SECRET);

module.exports = {
  issueToken,
  decodedToken,
};
