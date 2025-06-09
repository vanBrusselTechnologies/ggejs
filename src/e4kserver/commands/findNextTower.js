module.exports.name = "fnt";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    const C2SFindNextTowerVO = {};
    socket.client.socketManager.sendCommand("fnt", C2SFindNextTowerVO);
}