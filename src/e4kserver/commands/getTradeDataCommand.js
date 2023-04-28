module.exports = {
    name: "mmn",
    execute(socket, messageId) {
        let C2SMarketCarriageNotifyVO = {
            getCmdId: "mmn",
            params: {MID: messageId},
        }
        require('./../data').sendJsonVoSignal(socket, {"commandVO": C2SMarketCarriageNotifyVO, "lockConditionVO": null});
    }
}