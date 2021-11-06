const Review = require('../models/reviewModel');
const factory = require('./factoryController');

exports.createReview = factory.create(Review);
exports.deleteReview = factory.deleteById(Review);
exports.getReview = factory.getOneById(Review);
exports.getReviews = factory.getAll(Review);
exports.updateReview = factory.updateById(Review);
