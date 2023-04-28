module.exports = {
    name: "sli",
    execute(socket) {
        let C2SStartupLoginBonusVO = {
            getCmdId: "sli",
            params: {},
        }
        require('./../data').sendJsonVoSignal(socket, {"commandVO": C2SStartupLoginBonusVO, "lockConditionVO": null});
    }
}