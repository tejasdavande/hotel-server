const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    guestName: { type: String, required: true, trim: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, min: 1, default: 1 },
    totalPrice: { type: Number, min: 0 },
    status: {
      type: String,
      enum: ["booked", "cancelled", "checked-out"],
      default: "booked",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
