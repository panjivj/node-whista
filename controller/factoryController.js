const AppError = require('../helper/AppError');
const catchAsync = require('../helper/catchAsync');

exports.create = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    return res.status(201).json({
      status: 'Success',
      data: doc,
    });
  });

exports.deleteById = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) throw new AppError("Can't find document with that ID", 404);
    return res.status(204).json({
      status: 'Success',
      data: null,
    });
  });
