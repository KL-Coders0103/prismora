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
      trim: true,
      index: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    cost: {
      type: Number,
      default: 0
    },

    stock: {
      type: Number,
      default: 0
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

// Index for analytics
productSchema.index({ category: 1 });

module.exports = mongoose.model("Product", productSchema);