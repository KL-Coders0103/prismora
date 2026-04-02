const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["system", "sales", "ai", "analytics", "security"], // Synced with controller
      default: "system"
    },
    severity: {
      type: String,
      enum: ["info", "warning", "critical", "high"], // Added high to support UI logic
      default: "info"
    },
    source: {
      type: String,
      enum: ["system", "analytics_engine", "ml_engine", "user"],
      default: "system"
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Indexes for faster dashboard retrieval
alertSchema.index({ createdAt: -1 });
alertSchema.index({ severity: 1, isRead: 1 });

module.exports = mongoose.model("Alert", alertSchema);