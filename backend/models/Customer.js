 const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({

  name: String,

  email: String,

  region: String,

  totalOrders: Number,

  totalSpent: Number,

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Customer", customerSchema);