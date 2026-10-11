// server/controllers/webhookController.js
const stripe = require("../config/stripe");
const Booking = require("../models/Booking");

const handleStripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
  const session = event.data.object;

  try {
    const updated = await Booking.findOneAndUpdate(
      { stripeSessionId: session.id, status: "pending" },
      { status: "paid" }
    );

    if (!updated) {
      console.warn(`No pending booking matched for paid session ${session.id}`);
    }
  } catch (err) {
    console.error("Failed to update booking after payment:", err.message);
  }
}

  res.status(200).json({ received: true });
};

module.exports = handleStripeWebhook;