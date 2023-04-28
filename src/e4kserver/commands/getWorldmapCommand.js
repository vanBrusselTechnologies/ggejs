module.exports = {
    name: "gaa",
    /**
     * @param {Socket} socket
     * @param {number} kingdomId
     * @param {number} leftX
     * @param {number} topY
     * @param {number} rightX
     * @param {number} bottomY
     */
    execute(socket, kingdomId, leftX, topY, rightX, bottomY) {
        let C2SGetAreasVO = {
            getCmdId: "gaa",
            params: {
                KID: kingdomId,
                AX1: leftX,
                AY1: topY,
                AX2: rightX,
                AY2: bottomY,
            },
        }
        require('./../data').sendJsonVoSignal(socket, {
            "commandVO": C2SGetAreasVO,
            "lockConditionVO": "new DefaultLockConditionVO()"
        });
    }
}