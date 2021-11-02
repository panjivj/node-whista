const catchAsync = require('../helper/catchAsync');

exports.create = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    return res.status(200).json({
      status: 'Success',
      data: doc,
    });
  });
