const mongoose = require('mongoose');
const { Schema } = mongoose;

// Product Schema (embedded document)
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

// Quote Schema
const QuoteSchema = new Schema({
  buyerId: {
    type: String,
    required: [true, 'Buyer ID is required'],
    index: true
  },
  products: {
    type: [ProductSchema],
    required: [true, 'At least one product is required'],
    validate: {
      validator: function(products) {
        return products.length > 0;
      },
      message: 'Quote must contain at least one product'
    }
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },
  currentVersionId: {
    type: Schema.Types.ObjectId,
    ref: 'QuoteVersion'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for checking if quote is expired
QuoteSchema.virtual('isExpired').get(function() {
  return new Date() > this.expiresAt;
});

// Index for efficient querying
QuoteSchema.index({ buyerId: 1, isDeleted: 1 });
QuoteSchema.index({ expiresAt: 1 });

// Pre-save middleware to set expiry date if not provided
QuoteSchema.pre('save', function(next) {
  if (!this.expiresAt) {
    const expiryDays = process.env.QUOTE_EXPIRY_DAYS || 14;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(expiryDays));
    this.expiresAt = expiresAt;
  }
  next();
});

// Static method to find non-deleted quotes
QuoteSchema.statics.findActive = function(query = {}) {
  return this.find({ ...query, isDeleted: false });
};

// Instance method to extend expiry date
QuoteSchema.methods.extendExpiry = function(days = 14) {
  const newExpiryDate = new Date(this.expiresAt);
  newExpiryDate.setDate(newExpiryDate.getDate() + days);
  this.expiresAt = newExpiryDate;
  return this.save();
};

// Instance method to soft delete
QuoteSchema.methods.softDelete = function() {
  this.isDeleted = true;
  return this.save();
};

const Quote = mongoose.model('Quote', QuoteSchema);

module.exports = Quote;
