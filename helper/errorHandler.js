// const AppError = require('../helper/AppError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    err: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'Error',
      message: 'Something went wrong !',
    });
  }
};

module.exports = (err, req, res, next) => {
  // if the error object has no statuscode & status
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Fail';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res);
  }
};
