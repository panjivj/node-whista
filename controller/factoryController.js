const AppError = require('../helper/AppError');
const ApiFeatures = require('../helper/ApiFeatures');
const { catchAsync } = require('../helper/catchAsync');
const { response } = require('../helper/utils');

exports.create = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    response(res, doc, 201);
  });

exports.getOneById = (Model) =>
  catchAsync(async (req, res, next) => {
    const modelById = Model.findById(req.params.id);
    const queryBuild = new ApiFeatures(modelById, req.query).onlyFields();
    const doc = await queryBuild.query;
    if (!doc) return next(new AppError("Can't find document with that ID", 404));
    response(res, doc, 200);
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const queryBuild = new ApiFeatures(Model, req.query)
      .filter()
      .sort()
      .pagination()
      .onlyFields();
    const doc = await queryBuild.query;
    const count = await Model.count();

    res.status(200).json({
      status: 'success',
      records: doc.length,
      totalRecords: count,
      content: doc,
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

exports.updateImage = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id, fieldImage, urlId } = req.params;
    const fieldNameBuild = `${fieldImage}.$[element].url`;
    const updateOperator = {
      $set: { [fieldNameBuild]: 'zee13' },
    };

    const options = {
      arrayFilters: [
        {
          'element._id': urlId,
        },
      ],
      new: true,
      runValidators: true,
      rawResult: true,
    };

    const resUpdate = await Model.updateOne({ _id: id }, updateOperator, options);
    if (resUpdate.modifiedCount === 0) return next(new AppError('Failed to update', 400));
    response(res, 'Updated successfully', 200);
  });
