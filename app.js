const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routers/tourRouter');

const app = express();
app.use(morgan('dev'));

app.use(express.json({ limit: '20kb' }));

app.use('/status', (req, res) => {
  res.status(200).json({ data: 'OK' });
});

app.use(`${process.env.API_VERSION}/tour`, tourRouter);
// app.use('/api/v1/users');
// app.use('/api/v1/reviews');

module.exports = app;
