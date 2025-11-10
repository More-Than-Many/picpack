const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middleware/async");
const auth = require("../middleware/auth");
const multer = require("multer");
const { postModel, validate } = require("../models/post");
const path = require("path");
const fs = require("fs");

const temp_folder_path = "./temp";

function delete_files(folder_path) {
  fs.readdir(folder_path, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    files.forEach((file) => {
      var file_path = path.join(folder_path, file);

      fs.unlink(file_path, (unlinkErr) => {
        if (unlinkErr) {
          console.error(`Error deleting file ${file_path}:`, unlinkErr);
        } else {
          console.log(`Deleted: ${file_path}`);
        }
      });
    });
  });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "temp/");
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
  if (!file) {
    cb(new Error("No file uploaded for this field!"), false);
  }

  const allowedFileTypes = /jpeg|jpg|png/;
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only jpeg|jpg|png images are allowed!"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter,
}).single("upload_img");

router.post(
  "/",
  auth,
  upload,
  asyncMiddleware(async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No File Uploaded");
    }

    req.body.user = req.user._id;
    const { error } = validate(req.body);
    if (error) {
      delete_files(temp_folder_path);
      return res.status(400).send(error.details[0].message);
    }

    let post = new postModel({
      img_path: "http://localhost:8080/" + req.file.filename,
      user: req.body.user,
      caption: req.body.caption,
    });

    try {
      await post.save();
    } catch (error) {
      delete_files(temp_folder_path);
      return res.status(400).send(error.details[0].message);
    }

    return res.status(200).send("successful upload");
  })
);

module.exports = router;
