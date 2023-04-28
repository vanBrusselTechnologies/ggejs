module.exports = {
    name: "blm",
    execute(socket, battleLogId) {
        let C2SBattleLogMiddleVO = {
            getCmdId: "blm",
            params: {LID: battleLogId},
        }
        require('./../data').sendJsonVoSignal(socket, {"commandVO": C2SBattleLogMiddleVO, "lockConditionVO": null});
    }
}