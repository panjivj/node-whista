const crypto = require('crypto');
const util = require('util');
const bucket = require('./storage');
const AppError = require('./AppError');

const { format } = util;

// only take the wanted field
const filterObj = (obj, ...allowed) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowed.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const filterRemoveObj = (obj, ...removed) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (!removed.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const response = (res, doc, statusCode) => {
  res.status(statusCode).json({
    status: 'success',
    content: doc,
  });
};

const convertRp = (money) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
    money * 1,
  );

const createHashHex = (hashAlgo, willbeHashed) =>
  crypto.createHash(hashAlgo).update(willbeHashed).digest('hex');

const saveImageToStorage = (file) =>
  new Promise((resolve, reject) => {
    const { originalname, buffer } = file;
    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(originalname.replace(/ /g, '_')); //regex remove space
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream
      .on('finish', () => {
        const publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`,
        );
        resolve(publicUrl);
      })
      .on('error', () => {
        reject(new AppError(`Unable to upload image, something went wrong`));
      })
      .end(buffer); //send file
  });

module.exports = {
  filterObj,
  filterRemoveObj,
  response,
  createHashHex,
  convertRp,
  saveImageToStorage,
};
