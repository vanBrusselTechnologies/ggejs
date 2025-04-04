module.exports.name = "jaa";
/**
 * @param {Socket} socket
 * @param {InteractiveMapobject} worldMapArea
 */
module.exports.execute = function (socket, worldMapArea) {
    const C2SJoinAreaVO = {
        getCmdId: "jaa", params: {
            PY: worldMapArea.position.Y, PX: worldMapArea.position.X, KID: worldMapArea.kingdomId,
        },
    }
    require('../data').sendCommandVO(socket, C2SJoinAreaVO);
}