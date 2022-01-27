const crypto = require('crypto');

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

module.exports = {
  filterObj,
  filterRemoveObj,
  response,
  createHashHex,
  convertRp,
};
