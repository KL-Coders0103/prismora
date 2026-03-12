const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({

  date: Date,

  product: String,

  category: String,

  quantity: Number,

  revenue: Number,

  region: String

}, { timestamps: true });

module.exports = mongoose.model("Sales", salesSchema);