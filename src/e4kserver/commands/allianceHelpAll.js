module.exports.name = "aha";
/**
 * @param {Socket} socket
 * @param {number} kingdomId
 */
module.exports.execute = function (socket, kingdomId = 15) {
    const C2SAllianceHelpAllVO = {KID: kingdomId};
    socket.client.socketManager.sendCommand("aha", C2SAllianceHelpAllVO);
}