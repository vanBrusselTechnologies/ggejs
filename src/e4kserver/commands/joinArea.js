module.exports.name = "jaa";
/**
 * @param {Socket} socket
 * @param {InteractiveMapobject} worldmapArea
 */
module.exports.execute = function (socket, worldmapArea) {
    let C2SJoinAreaVO = {
        getCmdId: "jaa", params: {
            PY: worldmapArea.position.Y, PX: worldmapArea.position.X, KID: worldmapArea.kingdomId,
        },
    }
    require('../data').sendCommandVO(socket, C2SJoinAreaVO);
}