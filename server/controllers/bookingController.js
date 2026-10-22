// server/controllers/bookingController.js
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const stripe = require("../config/stripe");
const mongoose = require("mongoose");

const createBooking = async (req, res) => {
  try {
    const { eventId, quantity } = req.body;
    const event = await Event.findById(eventId).select("organizer");
if (!event) {
  return res.status(404).json({ message: "Event not found" });
}
if (event.organizer.toString() === req.user.userId) {
  return res.status(403).json({ message: "You can't book tickets for your own event" });
}

    // Atomically check AND decrement in one step — prevents overselling
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, ticketsRemaining: { $gte: quantity } },
      { $inc: { ticketsRemaining: -quantity } },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(400).json({ message: "Not enough tickets remaining" });
    }

    const booking = await Booking.create({
      user: req.user.userId,
      event: eventId,
      quantity,
      status: "pending",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// "My bookings" — a logged-in user's own booking history
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId }).populate("event");
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createCheckoutSession = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId).populate("event");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not your booking" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ message: "This booking is not awaiting payment" });
    }
    if (booking.expiresAt < new Date()) {
  return res.status(400).json({ message: "This booking has expired. Please book again." });
}

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: booking.event.title },
            unit_amount: Math.round(booking.event.price * 100),
          },
          quantity: booking.quantity,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/booking-success?bookingId=${booking._id}`,
      cancel_url: `http://localhost:5173/booking-cancelled`,
    });

    booking.stripeSessionId = session.id;
    await booking.save();

    res.status(200).json({ checkoutUrl: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = await Booking.findById(id).populate({
      path: "event",
      populate: { path: "organizer", select: "name" },
    });

    if (!booking || booking.user.toString() !== req.user.userId) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createBooking, getMyBookings, createCheckoutSession, getBookingById };