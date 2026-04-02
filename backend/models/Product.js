const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    category: {
      type: String,
      required: true,
      trim: true
      // Removed redundant index: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    cost: {
      type: Number,
      default: 0,
      min: 0
    },
    stock: {
      type: Number,
      default: 0,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Explicit Index for Analytics filtering
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });

module.exports = mongoose.model("Product", productSchema);