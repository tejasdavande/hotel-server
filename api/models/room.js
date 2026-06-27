const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    number: { type: String, required: true, unique: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ["single", "double", "deluxe", "suite"],
      default: "single",
    },
    pricePerNight: { type: Number, required: true, min: 0 },
    capacity: { type: Number, required: true, min: 1, default: 1 },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
