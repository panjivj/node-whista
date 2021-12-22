const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

const catchAsyncFinally = (fn) => (req, res, next) => {
  fn(req, res, next)
    .catch(next)
    .finally(() => {
      res.fnFinally();
    });
};

module.exports = {
  catchAsync,
  catchAsyncFinally,
};
