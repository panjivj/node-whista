const Tour = require('../models/tourModel');

exports.getTours = async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).json(tours);
};

exports.getTourById = async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);
  res.status(200).json({ tour });
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

exports.patchTour = async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.tourId, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json(tour);
};

exports.deleteTour = async (req, res, next) => {
  // const tour = await Tour.findOneAndDelete(req.params.tourId);
  const tour = await Tour.findByIdAndDelete(req.params.tourId);
  console.log(tour);
  res.status(200).json(tour);
};
