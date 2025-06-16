module.exports.name = "jaa";
/**
 * @param {Client} client
 * @param {InteractiveMapobject} worldMapArea
 */
module.exports.execute = function (client, worldMapArea) {
    const C2SJoinAreaVO = {PY: worldMapArea.position.Y, PX: worldMapArea.position.X, KID: worldMapArea.kingdomId};
    client.socketManager.sendCommand("jaa", C2SJoinAreaVO);
}