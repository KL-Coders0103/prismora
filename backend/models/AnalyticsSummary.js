const mongoose = require("mongoose");

// This collection is designed to be a Singleton (only 1 document ever exists)
const analyticsSummarySchema = new mongoose.Schema(
  {
    totalRevenue: {
      type: Number,
      default: 0
    },
    totalSales: {
      type: Number,
      default: 0
    },
    customers: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true // Automatically gives us createdAt and updatedAt
  }
);

module.exports = mongoose.model("AnalyticsSummary", analyticsSummarySchema);