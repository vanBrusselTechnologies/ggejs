module.exports = {
    name: "rms",
    execute(socket, messageId) {
        let C2SReadMessagesVO = {
            getCmdId: "rms",
            params: {MID: messageId},
        }
        require('./../data').sendJsonVoSignal(socket, {"commandVO": C2SReadMessagesVO, "lockConditionVO": null});
    }
}