module.exports.name = "aha";
/**
 * @param {BaseClient} client
 * @param {number} kingdomId
 */
module.exports.execute = function (client, kingdomId = 15) {
    const C2SAllianceHelpAllVO = {KID: kingdomId};
    client.socketManager.sendCommand("aha", C2SAllianceHelpAllVO);
}