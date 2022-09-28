module.exports = {
    name: "ain",
    /**
     * @param {Socket} socket
     * @param {number} allianceId
     */
    execute(socket, allianceId) {
        let C2SGetAllianceInfoVO = {
            params: {
                AID: allianceId,
            },
            getCmdId: "ain",
        }
        require('./../data').sendJsonVoSignal(socket, { "commandVO": C2SGetAllianceInfoVO, "lockConditionVO": "new DefaultLockConditionVO()" });
    }
}