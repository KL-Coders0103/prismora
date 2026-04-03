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
    // ✅ Replaced `isRead: Boolean` with an array to track exactly WHICH users have read the alert
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" // Ensure this matches the exact name of your User model exported in mongoose
      }
    ]
  },
  {
    timestamps: true
  }
);

// Indexes for faster dashboard retrieval
alertSchema.index({ createdAt: -1 });

// ✅ Updated index: swapped `isRead` for `readBy` to optimize the $ne (not equal) queries in the controller
alertSchema.index({ severity: 1, readBy: 1 });

module.exports = mongoose.model("Alert", alertSchema);