const mongoose = require("mongoose");

const insightSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["trend", "forecast", "anomaly", "recommendation"],
      default: "trend"
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    impact: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low"
    },
    source: {
      type: String,
      enum: ["analytics", "ml", "ai"],
      default: "ai"
    }
  },
  {
    timestamps: true
  }
);

// Indexes for faster dashboard filtering and timeline sorting
insightSchema.index({ type: 1 });
insightSchema.index({ createdAt: -1 });
insightSchema.index({ confidence: -1 }); // Useful for querying "Highest Confidence Insights"

module.exports = mongoose.model("Insight", insightSchema);