module.exports.name = "jaa";
/**
 * @param {Socket} socket
 * @param {InteractiveMapobject} worldMapArea
 */
module.exports.execute = function (socket, worldMapArea) {
    const C2SJoinAreaVO = {PY: worldMapArea.position.Y, PX: worldMapArea.position.X, KID: worldMapArea.kingdomId};
    socket.client.socketManager.sendCommand("jaa", C2SJoinAreaVO);
}