const quoteService = require('../services/quote.service');
const { AppError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

/**
 * Quote Controller
 * Handles HTTP requests for quote operations
 */
class QuoteController {
  /**
   * Get all quotes for the authenticated buyer
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getAllQuotes(req, res, next) {
    try {
      const buyerId = req.user.id;
      const quotes = await quoteService.getAllQuotes(buyerId);
      
      res.status(200).json({
        status: 'success',
        results: quotes.length,
        data: { quotes }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a specific quote by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getQuoteById(req, res, next) {
    try {
      const { id: quoteId } = req.params;
      const buyerId = req.user.id;
      
      const quote = await quoteService.getQuoteById(quoteId, buyerId);
      
      res.status(200).json({
        status: 'success',
        data: { quote }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new quote
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async createQuote(req, res, next) {
    try {
      const quoteData = req.body;
      const buyerId = req.user.id;
      const userId = req.user.id; // In a real app, this might be different from buyerId
      
      const newQuote = await quoteService.createQuote(quoteData, buyerId, userId);
      
      res.status(201).json({
        status: 'success',
        data: { quote: newQuote }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update an existing quote
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async updateQuote(req, res, next) {
    try {
      const { id: quoteId } = req.params;
      const updateData = req.body;
      const buyerId = req.user.id;
      const userId = req.user.id;
      
      const updatedQuote = await quoteService.updateQuote(
        quoteId,
        updateData,
        buyerId,
        userId
      );
      
      res.status(200).json({
        status: 'success',
        data: { quote: updatedQuote }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Extend the expiry date of a quote
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async extendQuoteExpiry(req, res, next) {
    try {
      const { id: quoteId } = req.params;
      const { days } = req.body;
      const buyerId = req.user.id;
      
      const updatedQuote = await quoteService.extendQuoteExpiry(quoteId, days, buyerId);
      
      res.status(200).json({
        status: 'success',
        data: { quote: updatedQuote }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a quote (soft delete)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async deleteQuote(req, res, next) {
    try {
      const { id: quoteId } = req.params;
      const buyerId = req.user.id;
      
      await quoteService.deleteQuote(quoteId, buyerId);
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get version history for a quote
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getQuoteVersionHistory(req, res, next) {
    try {
      const { id: quoteId } = req.params;
      const buyerId = req.user.id;
      
      const versions = await quoteService.getQuoteVersionHistory(quoteId, buyerId);
      
      res.status(200).json({
        status: 'success',
        results: versions.length,
        data: { versions }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new QuoteController();
