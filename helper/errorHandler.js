const AppError = require('./AppError');

const castErrorDb = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

// const validatorError = (err) => {
//   const message
// }

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    ...err,
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
      status: 'error',
      message: 'Something went wrong !',
    });
  }
};

module.exports = (err, req, res, next) => {
  // if the error object has no statuscode & status
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') err = castErrorDb(err);
    sendErrorProd(err, res);
  }
};
