// server/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser=require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const handleStripeWebhook = require("./controllers/webhookController");
const { startExpiryJob } = require("./jobs/expireBookings");

const app = express();
connectDB();
startExpiryJob();

app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
})
);

app.use(cookieParser());

app.use(express.json()); // applies to every route registered AFTER this line

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
/*
Step 4: Test in Postman
Log in as a regular user (not organizer) — copy the token.
POST http://localhost:5000/api/bookings with header Authorization: Bearer <token> and body:
json
{ "eventId": "<paste an actual event _id from your earlier createEvent test>", "quantity": 2 }
Check the response — you should get back a Booking document with status: "pending".
GET http://localhost:5000/api/events/:id (from earlier) — confirm ticketsRemaining actually decreased by 2.
The important test: try booking a quantity larger than what's left — confirm you get the 400 "Not enough tickets remaining" response, and that ticketsRemaining did not change (proving the atomic condition worked).
GET http://localhost:5000/api/bookings/my-bookings — confirm it shows your booking with the event populated.

Once this is working, the next checkpoint is Stripe integration — creating a Checkout session for a pending booking, and the webhook that flips it to "paid" using that stripeSessionId field we've been holding in reserve. Want to move there next, or first add the "release expired pending holds" logic we talked about earlier?
*/