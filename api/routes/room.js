const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/room");

// Public reads
router.get("/", getRooms);
router.get("/:roomId", getRoom);

// Protected writes
router.post("/", checkAuth, createRoom);
router.patch("/:roomId", checkAuth, updateRoom);
router.delete("/:roomId", checkAuth, deleteRoom);

module.exports = router;
