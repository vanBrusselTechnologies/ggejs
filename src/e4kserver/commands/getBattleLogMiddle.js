module.exports.name = "blm";
/**
 * @param {Socket} socket
 * @param {number} battleLogId
 */
module.exports.execute = function (socket, battleLogId) {
    const C2SBattleLogMiddleVO = {LID: battleLogId};
    socket.client.socketManager.sendCommand("blm", C2SBattleLogMiddleVO);
}