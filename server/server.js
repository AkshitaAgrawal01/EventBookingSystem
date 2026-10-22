require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const { startExpiryJob } = require("./jobs/expireBookings");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const handleStripeWebhook = require("./controllers/webhookController");

const app = express();

connectDB();
startExpiryJob();

// Stripe webhook: raw body, registered before express.json().
// It needs no CORS because Stripe is a server, not a browser.
app.post("/api/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => {
  res.send("EventBooking API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});