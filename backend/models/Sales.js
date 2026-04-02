const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true // Single-field index
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer"
    },
    product: {
      type: String,
      required: true,
      trim: true,
      index: true // Single-field index
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true // Single-field index
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    revenue: {
      type: Number,
      required: true,
      min: 0
    },
    region: {
      type: String,
      required: true,
      trim: true,
      index: true // Single-field index
    }
  },
  {
    timestamps: true
  }
);

// COMPOUND INDEXES (Critical for complex analytics queries)
// E.g. "Show me revenue over time for the North region"
salesSchema.index({ region: 1, date: 1 });
salesSchema.index({ category: 1, region: 1 });
salesSchema.index({ product: 1, date: 1 });

module.exports = mongoose.model("Sales", salesSchema);