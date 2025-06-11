// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/login
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user._id);

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    token,
  });
  

});
// POST /api/auth/register
exports.registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, address } = req.body;

  // Simple validation
  if (!username || !email || !password || !address) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists with that email' });
  }

  // Create user
  const user = await User.create({ username, email, password, address });

  if (!user) {
    return res.status(500).json({ message: 'Failed to create user' });
  }

  const token = generateToken(user._id);

  res.status(201).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    address: user.address,
    token,
  });
});
