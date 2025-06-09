module.exports.name = "gdi";
/**
 * @param {Socket} socket
 * @param {number} playerId
 */
module.exports.execute = function (socket, playerId) {
    const C2SGetDetailPlayerInfo = {PID: playerId};
    socket.client.socketManager.sendCommand("gdi", C2SGetDetailPlayerInfo);
}