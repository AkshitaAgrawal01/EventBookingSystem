// server/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true, // stored as bcrypt hash, never plain text
  },
  role: {
    type: String,
    enum: ["user", "organizer"],
    default: "user",
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);