module.exports.name = "afa";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    const C2SAllianceGetFameVO = {};
    socket.client.socketManager.sendCommand("afa", C2SAllianceGetFameVO);
}