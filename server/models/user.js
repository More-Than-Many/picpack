const mongoose = require("mongoose");
const config = require("config");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: { type: String, minlength: 5, maxlength: 25, required: true },
  password: { type: String, minlength: 5, maxlength: 1024, required: true },
  img_path: { type: String, maxlength: 1024, required: true },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, username: this.username },
    config.get("jwtPrivateKey"),
    { expiresIn: "180m" }
  );
  return token;
};

const userModel = mongoose.model("users", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(5).max(25).required(),
    password: Joi.string().min(5).max(255).required(),
  }).required();

  return schema.validate(user);
}

module.exports.userModel = userModel;
module.exports.validate = validateUser;
