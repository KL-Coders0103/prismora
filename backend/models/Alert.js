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
      enum: ["info", "warning", "critical"],
      default: "info"
    },

    source: {
      type: String,
      enum: ["system", "analytics", "ai", "anomaly"],
      default: "system"
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low"
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


// Indexes for faster queries
alertSchema.index({ createdAt: -1 });
alertSchema.index({ severity: 1 });

module.exports = mongoose.model("Alert", alertSchema);