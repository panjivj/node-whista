const AppError = require('../helper/AppError');
const ApiFeatures = require('../helper/ApiFeatures');
const { catchAsync } = require('../helper/catchAsync');

const response = (res, doc, statusCode) => {
  res.status(statusCode).json({
    status: 'success',
    data: doc,
  });
};

exports.res = response;

exports.create = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    response(res, doc, 201);
  });

exports.getOneById = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) return next(new AppError("Can't find document with that ID", 404));
    response(res, doc, 200);
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const queryBuild = new ApiFeatures(Model, req.query).filter();
    const doc = await queryBuild.query;

    res.status(200).json({
      status: 'success',
      records: Object.keys(doc).length,
      data: doc,
    });
  });

exports.updateById = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) return next(new AppError("Can't find document with that ID", 404));
    response(res, doc, 200);
  });

exports.deleteById = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return next(new AppError("Can't find document with that ID", 404));
    // postman doesn't show response body if status is 204
    response(res, doc, 204);
  });
