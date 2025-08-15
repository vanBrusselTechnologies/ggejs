module.exports.name = "txc";
/**
 * @param {BaseClient} client
 * @param {number} taxRemaining
 */
module.exports.execute = function (client, taxRemaining = 29) {
    const C2SCollectTaxVO = {TR: taxRemaining};
    client.socketManager.sendCommand("txc", C2SCollectTaxVO);
}