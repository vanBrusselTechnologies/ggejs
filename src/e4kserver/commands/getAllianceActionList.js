module.exports.name = "all";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    const C2SAllianceActionListVO = {};
    socket.client.socketManager.sendCommand("all", C2SAllianceActionListVO);
}