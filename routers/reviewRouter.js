const express = require('express');
const reviewController = require('../controller/reviewController');

const router = express.Router();

router.route('/').post(reviewController.createReview);
router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
