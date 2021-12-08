const express = require('express');
const itineraryController = require('../controller/itineraryController');
const authController = require('../controller/authController');

const router = express.Router();

router.route('/').post(authController.protect, itineraryController.createItinerary);
router
  .route('/:id')
  .get(itineraryController.getItinerary)
  .delete(itineraryController.deleteItinerary);
module.exports = router;
