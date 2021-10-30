const express = require('express');
const tourController = require('../controller/tourController');

const router = express.Router();

router.route('/').get(tourController.getTours).post(tourController.createTour);
router.route('/:tourId').get(tourController.getTourById);

module.exports = router;
