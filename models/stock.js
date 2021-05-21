const mongoose = require("mongoose");
const getPrice = require("../utils/amount");

const stockSchema = new mongoose.Schema({
  ticker: { type: String, required: true },
  company: { type: String },
  quantity: { type: Number, default: 0 },
  price: { type: Number },
  amount: { type: Number },
  totalEarnings: { type: Number, default: 0 },
});

module.exports = mongoose.model("Stock", stockSchema);
