const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(), // file RAM me aayegi
});

module.exports = upload;
