module.exports.name = "afd";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    const C2SGetAttackableFactionDataVO = {};
    socket.client.socketManager.sendCommand("afd", C2SGetAttackableFactionDataVO);
}