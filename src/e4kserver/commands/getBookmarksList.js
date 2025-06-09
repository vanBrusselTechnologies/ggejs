module.exports.name = "gbl";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    const C2SBookmarkGetListVO = {};
    socket.client.socketManager.sendCommand("gbl", C2SBookmarkGetListVO);
}