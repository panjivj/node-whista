const express = require('express');
const tourController = require('../controller/tourController');
const authController = require('../controller/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, tourController.getTours)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.handleUploadImageTour,
    tourController.createTour,
  );
router
  .route('/:id')
  .get(tourController.getTour)
  .delete(tourController.deleteTour)
  .patch(tourController.updateTour);

router
  .route('/:id/:fieldImage/:urlId')
  .patch(tourController.handleUploadImageTour, tourController.updateImageTour);

module.exports = router;
