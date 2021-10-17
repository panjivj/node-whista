const express = require('express');
const placeController = require('../controller/placeController');

const router = express.Router();

router.route('/').get(placeController.getTour);

module.exports = router;
