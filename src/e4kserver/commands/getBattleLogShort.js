module.exports.name = "bls";
/**
 * @param {Client} client
 * @param {number} messageId
 */
module.exports.execute = function (client, messageId) {
    const C2SBattleLogShortVO = {MID: messageId};
    client.socketManager.sendCommand("bls", C2SBattleLogShortVO);
}