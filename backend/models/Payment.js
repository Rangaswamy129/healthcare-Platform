const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: String,
  doctorId: String,
  slot: String,
  amount: Number,
  paymentStatus: {
    type: String,
    default: "pending"
  },
  stripeSessionId: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Payment", paymentSchema);
