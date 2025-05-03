const express = require('express');
const quoteController = require('../controllers/quote.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { validate, createQuoteSchema, updateQuoteSchema, extendExpirySchema } = require('../validators/quote.validator');

const router = express.Router();
 
router.use(authMiddleware);

// Get all quotes for the authenticated buyer
router.get('/', quoteController.getAllQuotes);

// Get a specific quote by ID
router.get('/:id', quoteController.getQuoteById);

// Get version history for a quote
router.get('/:id/versions', quoteController.getQuoteVersionHistory);

// Create a new quote
router.post('/', validate(createQuoteSchema), quoteController.createQuote);

// Update an existing quote
router.put('/:id', validate(updateQuoteSchema), quoteController.updateQuote);

// Extend the expiry date of a quote
router.patch('/:id/extend', validate(extendExpirySchema), quoteController.extendQuoteExpiry);

// Delete a quote (soft delete)
router.delete('/:id', quoteController.deleteQuote);

module.exports = router;
