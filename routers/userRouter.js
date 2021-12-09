const express = require('express');
const userController = require('../controller/userController');
const authController = require('../controller/authController');

const router = express.Router();

router.use(authController.protect);

router.route('/').get(userController.getUser).patch(userController.updateUser);

module.exports = router;
