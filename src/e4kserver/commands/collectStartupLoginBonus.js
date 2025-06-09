module.exports.name = "slc";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    const C2SStartupLoginBonusCollectVO = {};
    socket.client.socketManager.sendCommand("slc", C2SStartupLoginBonusCollectVO);
}