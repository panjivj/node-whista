const express = require('express');
const tourController = require('../controller/tourController');
const authController = require('../controller/authController');

const router = express.Router();

router
  .route('/')
  .get(tourController.getTours)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.createTour,
  );
router
  .route('/:id')
  .get(tourController.getTour)
  .delete(tourController.deleteTour)
  .patch(tourController.updateTour);

module.exports = router;
