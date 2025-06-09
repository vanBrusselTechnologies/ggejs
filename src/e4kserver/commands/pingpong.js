module.exports.name = "pin";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    const PingPongVO = {}
    socket.client.socketManager.sendCommand("pinpon", PingPongVO);
}