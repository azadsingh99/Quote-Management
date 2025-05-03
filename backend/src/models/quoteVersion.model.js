const mongoose = require('mongoose');
const { Schema } = mongoose;

// Product Schema (embedded document) - same as in Quote model
const ProductSchema = new Schema({
  productId: {
    type: String,
    required: [true, 'Product ID is required']
  },
  name: {
    type: String,
    required: [true, 'Product name is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Product quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  }
}, { _id: false });

// QuoteVersion Schema
const QuoteVersionSchema = new Schema({
  quoteId: {
    type: Schema.Types.ObjectId,
    ref: 'Quote',
    required: true,
    index: true
  },
  versionNumber: {
    type: Number,
    required: true
  },
  products: {
    type: [ProductSchema],
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  createdBy: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    default: 'Update'
  }
}, {
  timestamps: true
});

// Compound index for efficient querying by quote and version
QuoteVersionSchema.index({ quoteId: 1, versionNumber: 1 }, { unique: true });

// Static method to create a new version
QuoteVersionSchema.statics.createVersion = async function(quoteId, products, notes, createdBy, reason = 'Update') {
  // Find the highest version number for this quote
  const highestVersion = await this.findOne({ quoteId })
    .sort({ versionNumber: -1 })
    .select('versionNumber')
    .lean();

  const versionNumber = highestVersion ? highestVersion.versionNumber + 1 : 1;

  // Create a new version
  return this.create({
    quoteId,
    versionNumber,
    products,
    notes,
    createdBy,
    reason
  });
};

const QuoteVersion = mongoose.model('QuoteVersion', QuoteVersionSchema);

module.exports = QuoteVersion;
