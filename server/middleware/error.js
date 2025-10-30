const multer = require("multer");

module.exports = function (err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).send("File size too large. Maximum size is 5MB");
    }
    return res.status(400).send(err);
  } else if (err) {
    return res.status(500).send(err);
  }
};
