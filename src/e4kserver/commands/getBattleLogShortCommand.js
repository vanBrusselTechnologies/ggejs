module.exports = {
    name: "bls",
    execute(socket, messageId) {
        let C2SBattleLogShortVO = {
            getCmdId: "bls",
            params: {MID: messageId},
        }
        require('./../data').sendJsonVoSignal(socket, {"commandVO": C2SBattleLogShortVO, "lockConditionVO": null});
    }
}