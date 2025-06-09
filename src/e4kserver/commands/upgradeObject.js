module.exports.name = "eup";
/**
 * @param {Socket} socket
 * @param {number} objectId
 * @param {number} offerId
 * @param {boolean} payResourcesWithRubies
 */
module.exports.execute = function (socket, objectId, offerId = -1, payResourcesWithRubies = false) {
    const C2SUpgradeObjectVO = {OID: objectId, PO: offerId, PWR: payResourcesWithRubies ? 1 : 0};
    socket.client.socketManager.sendCommand("eup", C2SUpgradeObjectVO);
}