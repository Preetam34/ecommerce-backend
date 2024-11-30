const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      min: 3,
      max: 20,
      required: true,
    },

    lastName: {
      type: String,
      trim: true,
      min: 3,
      max: 20,
      required: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 30,
      lowercase: true,
    },

    gender: {
      type: String,
      trim: true,
      enum: ["Male", "Female", "Prefer Not To Say"],
    },

    hash_password: {
      type: String,
      required: true,
    },

  },

  { timestamps: true }
);


userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.methods.authenticate = function (password) {
  return bcrypt.compareSync(password, this.hash_password);
};

module.exports = mongoose.model("User", userSchema);
