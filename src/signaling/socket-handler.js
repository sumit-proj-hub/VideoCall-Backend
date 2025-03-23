import { Server } from "socket.io";
import roomState from "./room-state.js";

/** @typedef {import("./room-state.js").PeerInfo} PeerInfo */

/**
 * Utility function to emit events to other peers connected to room
 * @param {Map<string, PeerInfo>} room - Current Room
 * @param {string} curSocketId - Current Socket Id
 * @param {string} event - Event Name
 * @param {any} data - Data to send
 */
const emitToOtherPeers = (room, curSocketId, event, data) => {
  for (const socketId of room.keys()) {
    if (socketId === curSocketId) continue;
    const peerSocket = io.sockets.sockets.get(socketId);
    if (peerSocket !== undefined) {
      peerSocket.emit(event, data);
    }
  }
};

/**
 * Socket Signaling Server Handler
 * @param {Server} io
 */
const socketHandler = (io) => {
  io.on("connection", async (socket) => {
    console.log(`User ${socket.id} connected`);

    const roomId = socket.roomInfo.id;
    if (!roomState.has(roomId)) {
      roomState.set(roomId, new Map());
    }

    const curRoom = roomState.get(roomId);
    const curPeer = {
      userData: socket.user,
      sdp: null,
      iceCandidates: []
    };
    curRoom.set(socket.id, curPeer);

    emitToOtherPeers(curRoom, socket.id, "userJoined", socket.user);

    socket.on("disconnect", (reason) => {
      console.log(`User ${socket.id} disconnected. Reason: ${reason}`);

      emitToOtherPeers(curRoom, socket.id, "userLeft", socket.user);

      curRoom.delete(socket.id);
      if (curRoom.size === 0) {
        roomState.delete(roomId);
      }
    });

    socket.on("sdp", (sdp) => {
      curPeer.sdp = sdp;
    });

    socket.on("ice", (iceCandidate) => {
      curPeer.iceCandidates.push(iceCandidate);
    });
  });
};

export default socketHandler;
