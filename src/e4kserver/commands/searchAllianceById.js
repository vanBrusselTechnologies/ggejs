module.exports.name = "ain";
/**
 * @param {Socket} socket
 * @param {number} allianceId
 */
module.exports.execute = function (socket, allianceId) {
    if (allianceId == null) return;
    const C2SGetAllianceInfoVO = {AID: allianceId};
    socket.client.socketManager.sendCommand("ain", C2SGetAllianceInfoVO);
}