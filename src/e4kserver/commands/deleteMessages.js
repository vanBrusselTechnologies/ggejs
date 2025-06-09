module.exports.name = "dms";
/**
 * @param {Socket} socket
 * @param {number[]} messageIds
 */
module.exports.execute = function (socket, messageIds) {
    const C2SDeleteMessageVO = {MIDS: messageIds};
    socket.client.socketManager.sendCommand("dms", C2SDeleteMessageVO);
}