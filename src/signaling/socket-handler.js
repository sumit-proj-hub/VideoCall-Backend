import { Server } from "socket.io";
import roomState from "./room-state.js";
import { emitToOtherPeers } from "../utils/socket-utils.js";

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

    emitToOtherPeers(io, curRoom, socket.id, "userJoined", socket.user);

    socket.on("disconnect", (reason) => {
      console.log(`User ${socket.id} disconnected. Reason: ${reason}`);

      emitToOtherPeers(io, curRoom, socket.id, "userLeft", socket.user);

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
