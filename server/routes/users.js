const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const { userModel, validate } = require("../models/user");
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/async");
const multer = require("multer");
const { delete_files, move_files } = require("../util/fs_util");

const temp_path = "./temp";
const upload_path = "./uploads";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "temp/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg");
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG images are allowed!"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter,
}).single("upload_img");

router.get(
  "/me",
  auth,
  asyncMiddleware(async (req, res) => {
    const user = req.user;
    res.send(user);
  })
);

router.post(
  "/",
  upload,
  asyncMiddleware(async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No File Uploaded");
    }

    const { error } = validate(req.body);
    if (error) {
      delete_files(temp_path);
      return res.status(400).send(error.details[0].message);
    }

    move_files(temp_path, upload_path, req.file.filename);

    const user = new userModel({
      username: req.body.username,
      password: req.body.password,
      img_path: "http://localhost:8080/" + req.file.filename,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    try {
      await user.save();
    } catch (error) {
      delete_files(temp_folder_path);
      return res.status(400).send(error.details[0].message);
    }

    const token = user.generateAuthToken();
    res.header("x-auth-token", token).send(_.pick(user, ["_id", "username"]));
  })
);

module.exports = router;
