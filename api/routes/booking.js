const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const {
  getBookings,
  createBooking,
  cancelBooking,
} = require("../controllers/booking");

// All booking routes require authentication
router.get("/", checkAuth, getBookings);
router.post("/", checkAuth, createBooking);
router.patch("/:bookingId/cancel", checkAuth, cancelBooking);

module.exports = router;
