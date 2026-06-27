const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please provide a valid email"],
    },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
