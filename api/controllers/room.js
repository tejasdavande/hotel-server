const mongoose = require("mongoose");
const Room = require("../models/room");
const asyncHandler = require("../common/asyncHandler");

// GET /room — list rooms
const getRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find().select("-__v");
  return res.status(200).json({ count: rooms.length, rooms });
});

// GET /room/:roomId
const getRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.roomId).select("-__v");
  if (!room) {
    return res.status(404).json({ message: "No room found for the given id" });
  }
  return res.status(200).json(room);
});

// POST /room — create a room
const createRoom = asyncHandler(async (req, res) => {
  const { number, type, pricePerNight, capacity, description } = req.body;
  if (!number || pricePerNight === undefined) {
    return res
      .status(400)
      .json({ message: "number and pricePerNight are required" });
  }

  const exists = await Room.findOne({ number });
  if (exists) {
    return res.status(409).json({ message: "Room number already exists" });
  }

  const room = new Room({
    _id: new mongoose.Types.ObjectId(),
    number,
    type,
    pricePerNight,
    capacity,
    description,
  });
  const created = await room.save();
  return res.status(201).json(created);
});

// PATCH /room/:roomId
const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findByIdAndUpdate(
    req.params.roomId,
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!room) {
    return res.status(404).json({ message: "No room found for the given id" });
  }
  return res.status(200).json(room);
});

// DELETE /room/:roomId
const deleteRoom = asyncHandler(async (req, res) => {
  const deleted = await Room.findByIdAndDelete(req.params.roomId);
  if (!deleted) {
    return res.status(404).json({ message: "No room found for the given id" });
  }
  return res.status(200).json({ message: "Room deleted", room: deleted });
});

module.exports = { getRooms, getRoom, createRoom, updateRoom, deleteRoom };
