module.exports.name = "ain";
/**
 * @param {Client} client
 * @param {number} allianceId
 */
module.exports.execute = function (client, allianceId) {
    if (allianceId == null) return;
    const C2SGetAllianceInfoVO = {AID: allianceId};
    client.socketManager.sendCommand("ain", C2SGetAllianceInfoVO);
}