const express = require('express');

const router = express.Router();

router.route('/').get(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
  });
});

module.exports = router;
