module.exports.name = "blm";
/**
 * @param {Client} client
 * @param {number} battleLogId
 */
module.exports.execute = function (client, battleLogId) {
    const C2SBattleLogMiddleVO = {LID: battleLogId};
    client.socketManager.sendCommand("blm", C2SBattleLogMiddleVO);
}