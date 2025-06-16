module.exports.name = "bld";
/**
 * @param {Client} client
 * @param {number} battleLogId
 */
module.exports.execute = function (client, battleLogId) {
    const C2SBattleLogDetailVO = {LID: battleLogId};
    client.socketManager.sendCommand("bld", C2SBattleLogDetailVO);
}