const mongoose = require("mongoose");

const analyticsSummarySchema = new mongoose.Schema({

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

});

module.exports = mongoose.model(
  "AnalyticsSummary",
  analyticsSummarySchema
);