const Joi = require('joi');

// Product validation schema
const productSchema = Joi.object({
  productId: Joi.string().default(() => `prod_${Date.now()}`).messages({
    'string.empty': 'Product ID is required'
  }),
  name: Joi.string().required().messages({
    'string.empty': 'Product name is required',
    'any.required': 'Product name is required'
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'number.base': 'Quantity must be a number',
    'number.min': 'Quantity must be at least 1',
    'any.required': 'Product quantity is required'
  }),
  price: Joi.number().min(0).default(0).messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price cannot be negative'
  })
});

// Create quote validation schema
const createQuoteSchema = Joi.object({
  products: Joi.array().items(productSchema).min(1).required().messages({
    'array.min': 'At least one product is required',
    'any.required': 'Products are required'
  }),
  notes: Joi.string().allow('').optional(),
  expiryDays: Joi.number().integer().min(1).max(90).optional().messages({
    'number.base': 'Expiry days must be a number',
    'number.min': 'Expiry days must be at least 1',
    'number.max': 'Expiry days cannot exceed 90'
  })
});

// Update quote validation schema
const updateQuoteSchema = Joi.object({
  products: Joi.array().items(productSchema).min(1).required().messages({
    'array.min': 'At least one product is required',
    'any.required': 'Products are required'
  }),
  notes: Joi.string().allow('').optional(),
  reason: Joi.string().optional()
});

// Extend expiry validation schema
const extendExpirySchema = Joi.object({
  days: Joi.number().integer().min(1).max(90).required().messages({
    'number.base': 'Days must be a number',
    'number.min': 'Days must be at least 1',
    'number.max': 'Days cannot exceed 90',
    'any.required': 'Days are required'
  })
});

// Validation middleware factory
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({ 
      status: 'error',
      message: errorMessage
    });
  }
  
  next();
};

module.exports = {
  validate,
  createQuoteSchema,
  updateQuoteSchema,
  extendExpirySchema
};
