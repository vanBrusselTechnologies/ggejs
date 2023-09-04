module.exports = {
    name: "gaa",
    execute: _execute
}

/**
 * Requests all Mapobjects and Players for the area between topX and bottomY
 * @param {Socket} socket
 * @param {number} kingdomId
 * @param {Coordinate} bottomLeftCorner
 * @param {Coordinate} topRightCorner
 * @returns {void}
 * @private
 */
function _execute(socket, kingdomId, bottomLeftCorner, topRightCorner) {
    let C2SGetAreaVO = {
        getCmdId: "gaa",
        params: {
            KID: kingdomId,
            AX1: bottomLeftCorner.X,
            AY1: bottomLeftCorner.Y,
            AX2: topRightCorner.X,
            AY2: topRightCorner.Y,
        },
    }
    require('./../data').sendJsonVoSignal(socket, {
        "commandVO": C2SGetAreaVO,
        "lockConditionVO": "new DefaultLockConditionVO()"
    });
}