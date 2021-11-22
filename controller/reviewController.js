const { catchAsync } = require('../helper/catchAsync');
const Review = require('../models/reviewModel');
const factory = require('./factoryController');
const { filterObj, response } = require('../helper/utils');

exports.createReview = factory.create(Review);
exports.deleteReview = factory.deleteById(Review);
exports.getReview = factory.getOneById(Review);

exports.updateReview = catchAsync(async (req, res, next) => {
  // only update field title, content and rating
  const filters = filterObj(req.body, 'title', 'content', 'rating');

  const doc = await Review.findByIdAndUpdate(req.params.id, filters, {
    new: true,
    runValidators: true,
  });

  response(res, doc, 200);
});
