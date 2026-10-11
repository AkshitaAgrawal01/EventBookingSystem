// server/controllers/eventController.js
const Event = require("../models/Event");

// CREATE — organizer only
const createEvent = async (req, res) => {
  try {
    const { title, description, venue, date, price, totalCapacity } = req.body;

    const event = await Event.create({
      title,
      description,
      venue,
      date,
      price,
      totalCapacity,
      ticketsRemaining: totalCapacity,
      organizer: req.user.userId,
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ALL — public, upcoming events only
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ date: { $gte: new Date() } })
      .populate("organizer", "name email")
      .sort({ date: 1 });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ONE — public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("organizer", "name email");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createEvent, getEvents, getEventById };