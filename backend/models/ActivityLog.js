const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },

    action: {
      type: String,
      required: true,
      trim: true
    },

    entity: {
      type: String,
      default: ""
    },

    metadata: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: true
  }
);


// Indexes for fast queries
activitySchema.index({ user: 1 });
activitySchema.index({ action: 1 });
activitySchema.index({ createdAt: -1 });

module.exports = mongoose.model("ActivityLog", activitySchema);