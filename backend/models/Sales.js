const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true
    },

    product: {
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
      index: true
    }
  },
  {
    timestamps: true
  }
);


// COMPOUND INDEX (important for analytics)
salesSchema.index({ date: 1, region: 1 });
salesSchema.index({ category: 1, region: 1 });

module.exports = mongoose.model("Sales", salesSchema);