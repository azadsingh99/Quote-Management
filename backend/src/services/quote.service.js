const quoteRepository = require('../repositories/quote.repository');
const { AppError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

class QuoteService {
  /**
   * Get all quotes for a buyer
   * @param {string} buyerId - The ID of the buyer
   * @returns {Promise<Array>} - Array of quotes
   */
  async getAllQuotes(buyerId) {
    try {
      return await quoteRepository.findAllByBuyer(buyerId);
    } catch (error) {
      logger.error(`Service error getting quotes for buyer ${buyerId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get a quote by ID
   * @param {string} quoteId - The ID of the quote
   * @param {string} buyerId - The ID of the buyer
   * @returns {Promise<Object>} - The quote object
   */
  async getQuoteById(quoteId, buyerId) {
    try {
      return await quoteRepository.findById(quoteId, buyerId);
    } catch (error) {
      logger.error(`Service error getting quote ${quoteId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create a new quote
   * @param {Object} quoteData - The quote data
   * @param {string} buyerId - The ID of the buyer
   * @param {string} userId - The ID of the user creating the quote
   * @returns {Promise<Object>} - The created quote
   */
  async createQuote(quoteData, buyerId, userId) {
    try {
      // Additional business logic can be added here
      // For example, checking product availability, applying discounts, etc.
      
      return await quoteRepository.create(quoteData, buyerId, userId);
    } catch (error) {
      logger.error(`Service error creating quote: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update a quote
   * @param {string} quoteId - The ID of the quote
   * @param {Object} updateData - The data to update
   * @param {string} buyerId - The ID of the buyer
   * @param {string} userId - The ID of the user updating the quote
   * @returns {Promise<Object>} - The updated quote
   */
  async updateQuote(quoteId, updateData, buyerId, userId) {
    try {
      // Additional business logic can be added here
      
      return await quoteRepository.update(
        quoteId, 
        updateData, 
        buyerId, 
        userId, 
        updateData.reason || 'Update'
      );
    } catch (error) {
      logger.error(`Service error updating quote ${quoteId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Extend the expiry date of a quote
   * @param {string} quoteId - The ID of the quote
   * @param {number} days - Number of days to extend
   * @param {string} buyerId - The ID of the buyer
   * @returns {Promise<Object>} - The updated quote
   */
  async extendQuoteExpiry(quoteId, days, buyerId) {
    try {
      if (!days || days <= 0) {
        throw new AppError('Extension days must be a positive number', 400);
      }
      
      // Enforce maximum extension limit
      const maxExtensionDays = 90;
      if (days > maxExtensionDays) {
        throw new AppError(`Cannot extend for more than ${maxExtensionDays} days`, 400);
      }
      
      return await quoteRepository.extendExpiry(quoteId, days, buyerId);
    } catch (error) {
      logger.error(`Service error extending quote ${quoteId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete a quote
   * @param {string} quoteId - The ID of the quote
   * @param {string} buyerId - The ID of the buyer
   * @returns {Promise<boolean>} - Success indicator
   */
  async deleteQuote(quoteId, buyerId) {
    try {
      return await quoteRepository.delete(quoteId, buyerId);
    } catch (error) {
      logger.error(`Service error deleting quote ${quoteId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get version history for a quote
   * @param {string} quoteId - The ID of the quote
   * @param {string} buyerId - The ID of the buyer
   * @returns {Promise<Array>} - Array of versions
   */
  async getQuoteVersionHistory(quoteId, buyerId) {
    try {
      return await quoteRepository.getVersionHistory(quoteId, buyerId);
    } catch (error) {
      logger.error(`Service error getting version history for quote ${quoteId}: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new QuoteService();
