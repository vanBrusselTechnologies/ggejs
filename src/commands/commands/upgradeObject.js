module.exports.name = "eup";
/**
 * @param {BaseClient} client
 * @param {number} objectId
 * @param {number} offerId
 * @param {boolean} payResourcesWithRubies
 */
module.exports.execute = function (client, objectId, offerId = -1, payResourcesWithRubies = false) {
    const C2SUpgradeObjectVO = {OID: objectId, PO: offerId, PWR: payResourcesWithRubies ? 1 : 0};
    client.socketManager.sendCommand("eup", C2SUpgradeObjectVO);
}