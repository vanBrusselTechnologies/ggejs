module.exports.name = "ado";
/**
 * @param {Client} client
 * @param {number} areaId
 * @param {number} kingdomId
 * @param {{[key: string]: number}} goodsObject
 */
module.exports.execute = function (client, areaId, kingdomId, goodsObject) {
    const C2SAllianceDonateVO = {AID: areaId, KID: kingdomId, RV: goodsObject};
    client.socketManager.sendCommand("ado", C2SAllianceDonateVO);
}