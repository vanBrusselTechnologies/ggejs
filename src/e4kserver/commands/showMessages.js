module.exports.name = "sne";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    const C2SShowMessagesVO = {}
    socket.client.socketManager.sendCommand("sne", C2SShowMessagesVO);
}