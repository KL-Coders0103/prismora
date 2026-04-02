const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true, // Automatically builds a unique index
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
    },
    region: {
      type: String,
      required: true,
      trim: true
      // Removed redundant index: true
    },
    totalOrders: {
      type: Number,
      default: 0,
      min: 0
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Explicit Indexes for Analytics
customerSchema.index({ region: 1 });
customerSchema.index({ totalSpent: -1 }); // Optimized for "Top Customers" queries

module.exports = mongoose.model("Customer", customerSchema);