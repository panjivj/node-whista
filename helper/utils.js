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

const generateRandomString = (length) => {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const createHashHex = (hashAlgo, willbeHashed) =>
  crypto.createHash(hashAlgo).update(willbeHashed).digest('hex');

const setToLowercaseAndDash = (words) => {
  if (typeof words === 'number') return words;
  const resultString = words.charAt(0).toUpperCase() + words.slice(1);
  return resultString
    .match(/[A-Z][a-z]+|[0-9]+/g)
    .join('-')
    .toLowerCase();
};

const modifyLettersOfText = (text, letterFrom, letterTo) => {
  if (!text || !letterFrom || !letterTo) return null;
  const search = letterFrom;
  const replaceWith = letterTo;
  return text.split(search).join(replaceWith);
};

const saveImageToStorage = (file, fullName) =>
  new Promise((resolve, reject) => {
    const nameModify = modifyLettersOfText(fullName, ' ', '-').toLowerCase();
    const { fieldname, mimetype, buffer } = file;
    const extension = mimetype.split('/')[1];
    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(
      `${setToLowercaseAndDash(fieldname)}/${setToLowercaseAndDash(
        fieldname,
      )}_${nameModify}_${generateRandomString(4)}.${extension}`,
    ); //file name
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream
      .on('finish', () => {
        const publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`,
        );
        resolve({ url: publicUrl });
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
  setToLowercaseAndDash,
  generateRandomString,
};
