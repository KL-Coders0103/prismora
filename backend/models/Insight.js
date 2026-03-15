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
      max: 100
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


// Index for faster queries
insightSchema.index({ type: 1 });
insightSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Insight", insightSchema);