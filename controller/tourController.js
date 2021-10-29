const Tour = require('../models/tourModel');

exports.getTour = (req, res, next) => {
  res.status(200).json({
    status: 'OK place',
  });
};

exports.createTour = async (req, res, next) => {
  try {
    const place = await Tour.create(req.body);

    res.status(200).json({
      data: place,
    });
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
};
