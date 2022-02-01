const cloud = require('@google-cloud/storage');
const path = require('path');

const serviceKey = path.join(__dirname, process.env.STORAGE_KEY_DIRECTORY);

const { Storage } = cloud;
const storage = new Storage({
  keyFilename: serviceKey,
  // projectId: 'wishta'
});
const bucket = storage.bucket(process.env.STORAGE_BUCKET_NAME);

module.exports = bucket;
