const multer = require('multer');

const multerMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: process.env.MAX_FILE_UPLOAD_SIZE_BYTE,
  },
});

module.exports = { multerMiddleware };
