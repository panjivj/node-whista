const express = require('express');
const dotenv = require('dotenv');
const placeController = require('./routers/placeRouter');

const app = express();
dotenv.config({ path: './.env' });

app.use(`${process.env.API_VERSION}/place`, placeController);
// app.use('/api/v1/users');
// app.use('/api/v1/reviews');

module.exports = app;
