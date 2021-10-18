// const Place = require('../models/placeModel');

exports.getTour = (req, res, next) => {
  res.status(200).json({
    status: 'OK place',
  });
};

exports.createTour = (req, res, next) => {
  console.log(req.body);
  res.status(200).json({
    status: 'Post place Oke',
  });
};
