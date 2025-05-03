const Quote = require('../models/quote.model');
const QuoteVersion = require('../models/quoteVersion.model');
const { AppError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

class QuoteRepository {
  /**
   * Find all quotes for a buyer
   * @param {string} buyerId - The ID of the buyer
   * @returns {Promise<Array>} - Array of quotes
   */
  async findAllByBuyer(buyerId) {
    try {
      return await Quote.findActive({ buyerId })
        .sort({ createdAt: -1 })
        .select('-__v');
    } catch (error) {
      logger.error(`Error finding quotes for buyer ${buyerId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find a quote by ID
   * @param {string} quoteId - The ID of the quote
   * @param {string} buyerId - The ID of the buyer (for authorization)
   * @returns {Promise<Object>} - The quote object
   */
  async findById(quoteId, buyerId) {
    try {
      const quote = await Quote.findOne({
        _id: quoteId,
        buyerId,
        isDeleted: false
      }).select('-__v');

      if (!quote) {
        throw new AppError('Quote not found', 404);
      }

      return quote;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid quote ID', 400);
      }
      if (error.isOperational) {
        throw error;
      }
      logger.error(`Error finding quote ${quoteId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create a new quote
   * @param {Object} quoteData - The quote data
   * @param {string} buyerId - The ID of the buyer
   * @param {string} createdBy - The ID of the user creating the quote
   * @returns {Promise<Object>} - The created quote
   */
  async create(quoteData, buyerId, createdBy) {
    try {
      // Set expiry date
      const expiryDays = quoteData.expiryDays || process.env.QUOTE_EXPIRY_DAYS || 14;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiryDays));

      // Create the quote
      const quote = await Quote.create({
        ...quoteData,
        buyerId,
        expiresAt
      });

      // Create the initial version
      const version = await QuoteVersion.createVersion(
        quote._id,
        quoteData.products,
        quoteData.notes || '',
        createdBy,
        'Initial creation'
      );

      // Update the quote with the current version ID
      quote.currentVersionId = version._id;
      await quote.save();

      return quote;
    } catch (error) {
      logger.error(`Error creating quote: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update a quote
   * @param {string} quoteId - The ID of the quote
   * @param {Object} updateData - The data to update
   * @param {string} buyerId - The ID of the buyer (for authorization)
   * @param {string} updatedBy - The ID of the user updating the quote
   * @param {string} reason - The reason for the update
   * @returns {Promise<Object>} - The updated quote
   */
  async update(quoteId, updateData, buyerId, updatedBy, reason = 'Update') {
    try {
      // Find the quote
      const quote = await this.findById(quoteId, buyerId);

      // Check if quote is expired
      if (quote.isExpired) {
        throw new AppError('Cannot update an expired quote', 400);
      }

      // Create a new version
      const version = await QuoteVersion.createVersion(
        quote._id,
        updateData.products,
        updateData.notes || quote.notes,
        updatedBy,
        reason
      );

      // Update the quote
      quote.products = updateData.products;
      quote.notes = updateData.notes || quote.notes;
      quote.currentVersionId = version._id;
      
      await quote.save();

      return quote;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      logger.error(`Error updating quote ${quoteId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Extend the expiry date of a quote
   * @param {string} quoteId - The ID of the quote
   * @param {number} days - Number of days to extend
   * @param {string} buyerId - The ID of the buyer (for authorization)
   * @returns {Promise<Object>} - The updated quote
   */
  async extendExpiry(quoteId, days, buyerId) {
    try {
      const quote = await this.findById(quoteId, buyerId);
      
      // Check if quote is already expired
      if (quote.isExpired) {
        throw new AppError('Cannot extend an already expired quote', 400);
      }
      
      // Extend the expiry date
      await quote.extendExpiry(days);
      
      return quote;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      logger.error(`Error extending expiry for quote ${quoteId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Soft delete a quote
   * @param {string} quoteId - The ID of the quote
   * @param {string} buyerId - The ID of the buyer (for authorization)
   * @returns {Promise<boolean>} - Success indicator
   */
  async delete(quoteId, buyerId) {
    try {
      const quote = await this.findById(quoteId, buyerId);
      await quote.softDelete();
      return true;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      logger.error(`Error deleting quote ${quoteId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get version history for a quote
   * @param {string} quoteId - The ID of the quote
   * @param {string} buyerId - The ID of the buyer (for authorization)
   * @returns {Promise<Array>} - Array of versions
   */
  async getVersionHistory(quoteId, buyerId) {
    try {
      // Verify the quote exists and belongs to the buyer
      await this.findById(quoteId, buyerId);
      
      // Get all versions for this quote
      const versions = await QuoteVersion.find({ quoteId })
        .sort({ versionNumber: -1 })
        .select('-__v');
      
      return versions;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      logger.error(`Error getting version history for quote ${quoteId}: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new QuoteRepository();
