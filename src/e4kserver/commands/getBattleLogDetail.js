module.exports.name = "bld";
/**
 * @param {Socket} socket
 * @param {number} battleLogId
 */
module.exports.execute = function (socket, battleLogId) {
    const C2SBattleLogDetailVO = {LID: battleLogId};
    socket.client.socketManager.sendCommand("bld", C2SBattleLogDetailVO);
}