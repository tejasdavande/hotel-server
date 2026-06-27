const mongoose = require("mongoose");
const Booking = require("../models/booking");
const Room = require("../models/room");
const asyncHandler = require("../common/asyncHandler");

const MS_PER_NIGHT = 1000 * 60 * 60 * 24;

// GET /booking — bookings for the authenticated user
const getBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.userData.userId })
    .populate("room", "number type pricePerNight")
    .select("-__v");
  return res.status(200).json({ count: bookings.length, bookings });
});

// POST /booking — create a booking (rejects overlapping dates for the room)
const createBooking = asyncHandler(async (req, res) => {
  const { roomId, guestName, checkIn, checkOut, guests } = req.body;
  if (!roomId || !guestName || !checkIn || !checkOut) {
    return res.status(400).json({
      message: "roomId, guestName, checkIn and checkOut are required",
    });
  }

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return res.status(400).json({ message: "Invalid checkIn/checkOut date" });
  }
  if (end <= start) {
    return res
      .status(400)
      .json({ message: "checkOut must be after checkIn" });
  }

  const room = await Room.findById(roomId);
  if (!room || !room.isActive) {
    return res.status(404).json({ message: "Room not found or inactive" });
  }

  // Reject if an active booking overlaps the requested range.
  const overlap = await Booking.findOne({
    room: roomId,
    status: "booked",
    checkIn: { $lt: end },
    checkOut: { $gt: start },
  });
  if (overlap) {
    return res
      .status(409)
      .json({ message: "Room is already booked for the selected dates" });
  }

  const nights = Math.ceil((end - start) / MS_PER_NIGHT);
  const booking = new Booking({
    _id: new mongoose.Types.ObjectId(),
    room: room._id,
    user: req.userData.userId,
    guestName,
    checkIn: start,
    checkOut: end,
    guests: guests || 1,
    totalPrice: nights * room.pricePerNight,
  });
  const created = await booking.save();
  return res.status(201).json(created);
});

// PATCH /booking/:bookingId/cancel — cancel own booking
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({
    _id: req.params.bookingId,
    user: req.userData.userId,
  });
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }
  if (booking.status === "cancelled") {
    return res.status(400).json({ message: "Booking is already cancelled" });
  }

  booking.status = "cancelled";
  await booking.save();
  return res.status(200).json({ message: "Booking cancelled", booking });
});

module.exports = { getBookings, createBooking, cancelBooking };
