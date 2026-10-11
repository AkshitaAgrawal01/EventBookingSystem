// server/routes/eventRoutes.js
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const requireOrganizer = require("../middleware/roleMiddleware");
const { createEvent, getEvents, getEventById } = require("../controllers/eventController");

// Public routes — anyone can browse events, no login required
router.get("/", getEvents);
router.get("/:id", getEventById);

// Protected + organizer-only route
router.post("/", protect, requireOrganizer, createEvent);

module.exports = router;