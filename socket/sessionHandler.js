const Session = require("../db/session");
const AuthApi = require("../api/authApi.js");

module.exports = (io, activeSessions) => {
  const joinSession = async function ({ sessionId, auth, teamId }) {
    const socket = this;
    let session = await Session.find(sessionId);

    // Make sure this session exists
    if (!session) return;

    // Make sure the session is active
    if (session.status !== "ACTIVE") return;

    // Make sure the user is logged in
    let me = await AuthApi.getMe(auth);
    if (!me) return;

    // Make sure the user is part of the team whose session they are trying to join

    if (me.id === session.creatorId) activeSessions[socket.id] = session;

    socket.join(sessionId);
  };

  const performScroll = function ({ scrollTop, sessionId }) {
    const socket = this;
    socket.to(sessionId).emit("scroll to", scrollTop);
  };

  return {
    joinSession,
    performScroll,
  };
};
