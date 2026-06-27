const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const asyncHandler = require("../common/asyncHandler");

// POST /user/signup
const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "Email id already exists." });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    name,
    email,
    password: hash,
  });
  await user.save();

  return res.status(201).json({ message: "User created", userId: user._id });
});

// POST /user/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "30h" }
  );

  return res.status(200).json({ message: "Auth successful", token });
});

module.exports = { signup, login };
