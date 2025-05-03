const Joi = require('joi');

exports.signupSchema = Joi.object({
  username: Joi.string().min(3).max(32).required(),
  password: Joi.string().min(6).max(128).required(),
  role: Joi.string().valid('buyer', 'admin').optional()
});

exports.loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});
