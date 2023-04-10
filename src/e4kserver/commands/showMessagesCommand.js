module.exports = {
    name: "sne", execute(socket) {
        let C2SShowMessagesVO = {
            getCmdId: "sne", params: {},
        }
        require('./../data').sendJsonVoSignal(socket, {"commandVO": C2SShowMessagesVO, "lockConditionVO": null});
    }
}