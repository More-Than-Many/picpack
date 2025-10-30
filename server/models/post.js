const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const Post = mongoose.model(
  "posts",
  new mongoose.Schema({
    img_path: { type: String, minlength: 1, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    caption: { type: String, minlength: 5, maxlength: 55, required: true },
  })
);

function validatePost(post) {
  const schema = Joi.object({
    caption: Joi.string().min(5).max(55).required(),
    user: Joi.objectId().required(),
  });

  return schema.validate(post);
}

module.exports.validate = validatePost;
module.exports.postModel = Post;
