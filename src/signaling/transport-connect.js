import { Socket } from "socket.io";

/**
 * Sets dtlsParameters and connects to transport
 * @param {Socket} socket
 * @param {import("./room-state").PeerInfo} curPeer
 * @param {boolean} isSender
 * @param {object} dtlsParameters
 * @returns {Promise<void>}
 */
export default async function transportConnect(
  socket,
  curPeer,
  isSender,
  dtlsParameters
) {
  if (typeof isProducer !== "boolean" || typeof dtlsParameters !== "object") {
    socket.disconnect(true);
    return;
  }
  if (isSender) await curPeer.sendTransport.connect({ dtlsParameters });
  else await curPeer.recvTransport.connect({ dtlsParameters });
}
