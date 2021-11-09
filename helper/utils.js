// take the field that only wanted
const filterObj = (obj, ...allowed) => {
  // allowed became array []
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowed.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

module.exports = {
  filterObj,
};
