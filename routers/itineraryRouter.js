const express = require('express');
const itineraryController = require('../controller/itineraryController');

const router = express.Router();

router.route('/').post(itineraryController.createItinerary);
router
  .route('/:id')
  .get(itineraryController.getItinerary)
  .delete(itineraryController.deleteItinerary);

module.exports = router;
