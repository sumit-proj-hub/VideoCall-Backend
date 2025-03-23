/**
 * @typedef {object} PeerInfo
 * @property {{name: string, email: string}} userData
 * @property {object|null} sdp
 * @property {object[]} iceCandidates
 */

/** @typedef {string} SocketId */

/** @type {Map<number, Map<SocketId, PeerInfo>>} */
const roomState = new Map();

export default roomState;
