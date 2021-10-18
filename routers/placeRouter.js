const express = require('express');
const placeController = require('../controller/placeController');

const router = express.Router();

router.route('/').get(placeController.getTour).post(placeController.createTour);

module.exports = router;
