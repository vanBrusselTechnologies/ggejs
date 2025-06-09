module.exports.name = "rms";
/**
 * @param {Socket} socket
 * @param {number} messageId
 */
module.exports.execute = function (socket, messageId) {
    const C2SReadMessagesVO = {MID: messageId};
    socket.client.socketManager.sendCommand("rms", C2SReadMessagesVO);
}