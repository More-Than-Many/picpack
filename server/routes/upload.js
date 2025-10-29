const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middleware/async");
const auth = require("../middleware/auth");
const multer = require("multer");
const { postModel } = require("../models/post");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif/;
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG images are allowed!"));
  }
};
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter,
}).single("upload_image");

function multer_check(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).send("File size too large. Maximum size is 5MB");
    }
    return res.status(400).send(err.message);
  } else if (err) {
    return res.status(500).send(err.message);
  }
}

router.post(
  "/",
  auth,
  upload,
  asyncMiddleware(async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No File Uploaded");
    }

    let post = new postModel({
      img_path: "http://localhost:8080/" + req.file.filename,
      user: req.user._id,
    });
    await post.save();

    return res.status(200).json(req.file);
  }),
  multer_check
);

module.exports = router;
