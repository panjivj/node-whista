const cloud = require('@google-cloud/storage');
const path = require('path');

const serviceKey = path.join(__dirname, '../keys/wishta-storage.json');

const { Storage } = cloud;
const storage = new Storage({
  keyFilename: serviceKey,
  // projectId: 'wishta'
});
const bucket = storage.bucket('wishta');

module.exports = bucket;
