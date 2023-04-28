module.exports = {
    name: "alb",
    execute(socket) {
        let C2SGetLoginBonusVO = {
            getCmdId: "alb",
            params: {},
        }
        require('./../data').sendJsonVoSignal(socket, {"commandVO": C2SGetLoginBonusVO, "lockConditionVO": null});
    }
}