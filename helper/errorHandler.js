const AppError = require('./AppError');

const castErrorDb = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const validatorError = (err) => new AppError(err.message, 400);

const handleJWTError = () => new AppError('Invalid Token', 401);

const handleJWTExpired = () => new AppError('Expired Token', 401);

const mongoServerError = (err) => {
  const message = err.message.split(':');
  return new AppError(message[0], 400);
};

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
  // console.log(err.name);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') err = castErrorDb(err);
    if (err.name === 'ValidationError') err = validatorError(err);
    if (err.name === 'MongoServerError') err = mongoServerError(err);
    if (err.name === 'JsonWebTokenError') err = handleJWTError();
    if (err.name === 'TokenExpiredError') err = handleJWTExpired();
    sendErrorProd(err, res);
  }
};
