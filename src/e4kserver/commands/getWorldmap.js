module.exports.name = "gaa";
/**
 * Requests all Mapobjects for the area between topX and bottomY
 * @param {Socket} socket
 * @param {number} kingdomId
 * @param {Coordinate} bottomLeftCorner
 * @param {Coordinate} topRightCorner
 * @returns {void}
 */
module.exports.execute = function (socket, kingdomId, bottomLeftCorner, topRightCorner) {
    let C2SGetAreaVO = {
        getCmdId: "gaa", params: {
            KID: kingdomId,
            AX1: bottomLeftCorner.X,
            AY1: bottomLeftCorner.Y,
            AX2: topRightCorner.X,
            AY2: topRightCorner.Y,
        },
    }
    require('../data').sendCommandVO(socket, C2SGetAreaVO);
}