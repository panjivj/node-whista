const express = require('express');
const morgan = require('morgan');
const AppError = require('./helper/AppError');
const tourRouter = require('./routers/tourRouter');
const userRouter = require('./routers/userRouter');
const reviewRouter = require('./routers/reviewRouter');
const itineraryRouter = require('./routers/itineraryRouter');
const authRouter = require('./routers/authRouter');
const errorHandler = require('./helper/errorHandler');

const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '20kb' }));

app.use('/status', (req, res) => {
  res.status(200).json({ data: 'OK' });
});

app.use(`${process.env.API_VERSION}/tour`, tourRouter);
app.use(`${process.env.API_VERSION}/user`, userRouter);
app.use(`${process.env.API_VERSION}/review`, reviewRouter);
app.use(`${process.env.API_VERSION}/itinerary`, itineraryRouter);
app.use(`${process.env.API_VERSION}/auth`, authRouter);
// app.use('/api/v1/reviews');

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

module.exports = app;
