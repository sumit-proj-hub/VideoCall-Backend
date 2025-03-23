import { Server } from "socket.io";

/** @typedef {import("../signaling/room-state").PeerInfo} */

/**
 * Utility function to emit events to other peers connected to room
 * @param {Server} io - Socket Server
 * @param {Map<string, PeerInfo>} room - Current Room
 * @param {string} curSocketId - Current Socket Id
 * @param {string} event - Event Name
 * @param {any} data - Data to send
 */
const emitToOtherPeers = (io, room, curSocketId, event, data) => {
  for (const socketId of room.keys()) {
    if (socketId === curSocketId) continue;
    const peerSocket = io.sockets.sockets.get(socketId);
    if (peerSocket !== undefined) {
      peerSocket.emit(event, data);
    }
  }
};

export { emitToOtherPeers };
