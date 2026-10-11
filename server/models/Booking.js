const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ["pending", "paid", "cancelled", "failed"], default: "pending" },
  stripeSessionId: { type: String },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);