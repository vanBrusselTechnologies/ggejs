module.exports.name = "mmn";
/**
 * @param {Socket} socket
 * @param {number} messageId
 */
module.exports.execute = function (socket, messageId) {
    const C2SMarketCarriageNotifyVO = {MID: messageId};
    socket.client.socketManager.sendCommand("mmn", C2SMarketCarriageNotifyVO);
}