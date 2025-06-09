module.exports.name = "sli";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    const C2SStartupLoginBonusVO = {};
    socket.client.socketManager.sendCommand("sli", C2SStartupLoginBonusVO);
}