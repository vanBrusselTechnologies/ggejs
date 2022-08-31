module.exports = {
    name: "gaa",
    /**
     * 
     * @param {number} allianceId
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
        require('./../data').sendJsonVoSignal(socket, { "commandVO": C2SGetAreasVO, "lockConditionVO": "new DefaultLockConditionVO()" });
    }
}