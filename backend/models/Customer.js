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
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
      index: true
    },

    region: {
      type: String,
      required: true,
      trim: true,
      index: true
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


// Indexes for analytics
customerSchema.index({ region: 1 });
customerSchema.index({ totalSpent: -1 });

module.exports = mongoose.model("Customer", customerSchema);