const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const { v4: uuidv4 } = require('uuid');

// In-memory user storage (replace with real database in production)
const users = [];

/**
 * Register a new user
 * @route POST /api/auth/signup
 * @access Public
 */
exports.signup = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      return next(new AppError('Username and password are required', 400));
    }
    const existing = await User.findOne({ username });
    if (existing) {
      return next(new AppError('Username already exists', 409));
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed, role });
    res.status(201).json({ status: 'success', data: { user: { id: user._id, username: user.username, role: user.role } } });
  } catch (err) {
    next(err);
  }
};

/**
 * Authenticate user & get token
 * @route POST /api/auth/login
 * @access Public
 */
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return next(new AppError('Username and password are required', 400));
    }
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError('Invalid username or password', 401));
    }
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || '1d' }
    );
    res.json({ status: 'success', data: { token, user: { id: user._id, username: user.username, role: user.role } } });
  } catch (err) {
    next(err);
  }
};
