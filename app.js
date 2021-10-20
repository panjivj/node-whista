const express = require('express');
const morgan = require('morgan');
const placeController = require('./routers/placeRouter');

const app = express();
app.use(morgan('dev'));

app.use(express.json({ limit: '20kb' }));

app.use(`${process.env.API_VERSION}/places`, placeController);
// app.use('/api/v1/users');
// app.use('/api/v1/reviews');

module.exports = app;
