import {
  createRoom,
  readRoom,
  readRoomsByOwner
} from "../models/room.model.js";

const createRoomHandler = async (req, res) => {
  try {
    const roomId = await createRoom(req.user.email);
    res.status(200).json({ roomId, success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

const getRoom = async (req, res) => {
  const { roomId } = req.query;
  if (roomId === undefined || isNaN(roomId)) {
    res.status(400).json({ error: "invalid roomId", success: false });
    return;
  }
  try {
    const room = await readRoom(roomId);
    if (!room) {
      res.status(404).json({ error: "Room not found", success: false });
      return;
    }
    res.status(200).json({ room: room, success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

const getRoomsByOwner = async (req, res) => {
  try {
    const rooms = await readRoomsByOwner(req.user.email);
    res.status(200).json({ rooms: rooms, success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

export { createRoomHandler, getRoom, getRoomsByOwner };
