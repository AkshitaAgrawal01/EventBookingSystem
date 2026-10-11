// server/models/Event.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  venue: { type: String, required: true },
  date: { type: Date, required: true },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  price: { type: Number, required: true },
  totalCapacity: { type: Number, required: true },
  ticketsRemaining: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);