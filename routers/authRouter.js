const express = require('express');
const authController = require('../controller/authController');

const router = express.Router();

router.route('/sign-up').post(authController.signUp);
router.route('/login').post(authController.login);
router.route('/forgot-password').post(authController.forgotPassword);

module.exports = router;
