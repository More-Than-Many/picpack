const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/async");
const { postModel } = require("../models/post");
const { userModel } = require("../models/user");

router.get(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const posts = await postModel.aggregate([{ $sample: { size: 5 } }]);
    const users = await userModel.populate(posts, {
      path: "user",
      model: userModel,
      select: "username img_path",
    });

    res.json(posts);
  })
);

module.exports = router;
