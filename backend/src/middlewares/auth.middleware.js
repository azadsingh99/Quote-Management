const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 * Adds user information to request object
 */
const authMiddleware = (req, res, next) => {
  try {
    // 1) Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Not authenticated. Please log in.', 401));
    }
    
    const token = authHeader.split(' ')[1];
    
    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3) Check if token is expired
    const currentTime = Date.now() / 1000;
    if (decoded.exp && decoded.exp < currentTime) {
      return next(new AppError('Your token has expired. Please log in again.', 401));
    }
    
    // 4) Add user info to request
    req.user = {
      id: decoded.id,
      role: decoded.role || 'buyer'
    };
    
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    return next(new AppError('Authentication failed. Please log in again.', 401));
  }
};

/**
 * Role-based authorization middleware
 * Restricts access based on user role
 * @param {string[]} roles - Array of allowed roles
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('You must be logged in to access this resource', 401));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    
    next();
  };
};

module.exports = {
  authMiddleware,
  restrictTo
};
