import { Server } from "socket.io";
import roomState from "./room-state.js";
import { createRouter } from "../sfu/mediasoup-config.js";
import initSession from "./init-session.js";

/**
 * Socket Signaling Server Handler
 * @param {Server} io
 */
const socketHandler = (io) => {
  io.on("connection", async (socket) => {
    console.log(`User ${socket.id} connected`);

    /** @type {number} */
    const roomId = socket.roomInfo.id;
    const roomIdStr = roomId.toString();
    if (!roomState.has(roomId)) {
      roomState.set(roomId, {
        router: await createRouter(),
        peerMap: new Map()
      });
    }

    const curRoom = roomState.get(roomId);

    /** @type {import("./room-state.js").PeerInfo} */
    const curPeer = {
      userData: socket.user,
      sendTransport: null,
      recvTransport: null,
      videoProducer: null,
      audioProducer: null,
      consumers: new Map(),
      isMicOn: false,
      isVideoOn: false
    };
    curRoom.peerMap.set(socket.id, curPeer);

    socket.on("initSession", async (_, callback) => {
      await initSession(socket, curPeer, curRoom, roomIdStr, callback);
    });

    socket.on("disconnect", (reason) => {
      console.log(`User ${socket.id} disconnected. Reason: ${reason}`);

      socket.to(roomIdStr).emit("userLeft", {
        id: socket.id,
        userData: curPeer.userData
      });
      socket.leave(roomIdStr);
      
      if (curPeer.sendTransport) curPeer.sendTransport.close();
      if (curPeer.recvTransport) curPeer.recvTransport.close();

      curRoom.peerMap.delete(socket.id);
      if (curRoom.peerMap.size === 0) {
        curRoom.router.close();
        roomState.delete(roomId);
      }
    });
  });
};

export default socketHandler;
