module.exports.name = "ado";
/**
 * @param {Socket} socket
 * @param {number} areaId
 * @param {number} kingdomId
 * @param {{[key: string]: number}} goodsObject
 */
module.exports.execute = function (socket, areaId, kingdomId, goodsObject) {
    const C2SAllianceDonateVO = {AID: areaId, KID: kingdomId, RV: goodsObject};
    socket.client.socketManager.sendCommand("ado", C2SAllianceDonateVO);
}