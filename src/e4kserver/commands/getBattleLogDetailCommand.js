module.exports = {
    name: "bld",
    execute(socket, battleLogId) {
        let C2SBattleLogDetailVO = {
            getCmdId: "bld",
            params: {LID: battleLogId},
        }
        require('./../data').sendJsonVoSignal(socket, {"commandVO": C2SBattleLogDetailVO, "lockConditionVO": null});
    }
}