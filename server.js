const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './.env' });
const app = require('./app');

const dbConnect = process.env.DATABASE.replace(
  '<USER>',
  process.env.DATABASE_USER,
).replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(dbConnect, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Db connection successful !');
  });

// to host in local or vps
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port} !`);
});

// to host in gcp
exports.server = app;
