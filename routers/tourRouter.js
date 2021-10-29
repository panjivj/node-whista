const express = require('express');
const tourController = require('../controller/tourController');

const router = express.Router();

router.route('/').get(tourController.getTour).post(tourController.createTour);

module.exports = router;
