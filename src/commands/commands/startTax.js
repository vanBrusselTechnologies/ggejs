module.exports.name = "txs";
/**
 * @param {Client} client
 * @param {number} taxType
 * @param {number} taxes
 */
module.exports.execute = function (client, taxType, taxes = 3) {
    const C2SStartCollectTaxVO = {TT: taxType, TX: taxes};
    client.socketManager.sendCommand("txs", C2SStartCollectTaxVO);
}