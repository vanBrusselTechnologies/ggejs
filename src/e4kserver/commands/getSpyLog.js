module.exports.name = "bsd";
/**
 * @param {Socket} socket
 * @param {number} messageId
 */
module.exports.execute = function (socket, messageId) {
    const C2SSpyLogVO = {MID: messageId};
    socket.client.socketManager.sendCommand("bsd", C2SSpyLogVO);
}