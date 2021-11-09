const { catchAsync } = require('../helper/catchAsync');
const Review = require('../models/reviewModel');
const factory = require('./factoryController');
const { filterObj } = require('../helper/utils');
const reviewModel = require('../models/reviewModel');

exports.createReview = factory.create(Review);
exports.deleteReview = factory.deleteById(Review);
exports.getReview = factory.getOneById(Review);
exports.getReviews = factory.getAll(Review);

exports.updateReview = catchAsync(async (req, res, next) => {
  // only update field title, content and rating
  const filters = filterObj(req.body, 'title', 'content', 'rating');
  console.log(filters);
  const doc = reviewModel.findByIdAndUpdate(req.params.id, filters, {
    new: true,
    runValidators: true,
  });
  console.log(doc);

  factory.res(res, doc, 200);
});
