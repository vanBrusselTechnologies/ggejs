module.exports.name = "alb";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    const C2SGetLoginBonusVO = {};
    socket.client.socketManager.sendCommand("alb", C2SGetLoginBonusVO);
}