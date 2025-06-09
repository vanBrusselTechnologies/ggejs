module.exports.name = "wsp";
/**
 * @param {Socket} socket
 * @param {string} playerName
 */
module.exports.execute = function (socket, playerName) {
    const C2SSearchPlayerVO = {PN: playerName};
    socket.client.socketManager.sendCommand("wsp", C2SSearchPlayerVO);
}