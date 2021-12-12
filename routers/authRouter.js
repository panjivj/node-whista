const express = require('express');
const authController = require('../controller/authController');

const router = express.Router();

router.route('/sign-up').post(authController.signUp);
router.route('/login').post(authController.login);
router.route('/forgot-password').post(authController.forgotPassword);
router.route('/reset-password/:token').patch(authController.resetPassword);
router.route('/refresh').get(authController.refresh);

router
  .route('/update-password')
  .patch(authController.protect, authController.updatePassword);

module.exports = router;
