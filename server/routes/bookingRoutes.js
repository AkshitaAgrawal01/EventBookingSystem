const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  createBooking,
  getMyBookings,
  createCheckoutSession,
  getBookingById,
} = require("../controllers/bookingController");

router.post("/", protect, createBooking);
router.get("/my-bookings", protect, getMyBookings);
router.get("/:id", protect, getBookingById);          // must stay below /my-bookings
router.post("/checkout/:bookingId", protect, createCheckoutSession);
module.exports = router;