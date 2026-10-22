const cron = require("node-cron");
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const stripe = require("../config/stripe");

const releaseExpiredBookings = async () => {
  const expired = await Booking.find({
    status: "pending",
    expiresAt: { $lt: new Date() },
  });

  for (const booking of expired) {
    try {
      if (booking.stripeSessionId) {
        const session = await stripe.checkout.sessions.retrieve(booking.stripeSessionId);

        if (session.status === "complete") continue;

        if (session.status === "open") {
          await stripe.checkout.sessions.expire(booking.stripeSessionId);
        }
      }

      const claimed = await Booking.findOneAndUpdate(
  { _id: booking._id, status: "pending" },
  { status: "cancelled", cancelReason: "expired", cancelledAt: new Date() }
);

      if (!claimed) continue;

      await Event.findByIdAndUpdate(booking.event, {
        $inc: { ticketsRemaining: booking.quantity },
      });

      console.log(`Released ${booking.quantity} ticket(s) from expired booking ${booking._id}`);
    } catch (err) {
      console.error(`Could not expire booking ${booking._id}:`, err.message);
    }
  }
};

const startExpiryJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      await releaseExpiredBookings();
    } catch (err) {
      console.error("Expiry job failed:", err.message);
    }
  });
};

module.exports = { startExpiryJob, releaseExpiredBookings };