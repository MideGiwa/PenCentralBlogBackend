const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin", "superadmin"],
    default: "user",
  },
  avatar: {
    type: String,
    default:
      "https://gravatar.com/avatar/2a0f0af5e25d833733fc4e1bc1b851ac?s=400&d=mp&r=x",
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
