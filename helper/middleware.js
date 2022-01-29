const multer = require('multer');

const multerMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_UPLOAD_SIZE_BYTE, 10),
  },
});

module.exports = { multerMiddleware };
