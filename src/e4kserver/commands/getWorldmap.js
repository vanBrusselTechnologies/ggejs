module.exports.name = "gaa";
/**
 * Requests all Mapobjects for the area between topX and bottomY
 * @param {Client} client
 * @param {number} kingdomId
 * @param {Coordinate} bottomLeftCorner
 * @param {Coordinate} topRightCorner
 */
module.exports.execute = function (client, kingdomId, bottomLeftCorner, topRightCorner) {
    const C2SGetAreaVO = {
        KID: kingdomId, AX1: bottomLeftCorner.X, AY1: bottomLeftCorner.Y, AX2: topRightCorner.X, AY2: topRightCorner.Y,
    };
    client.socketManager.sendCommand("gaa", C2SGetAreaVO);
}