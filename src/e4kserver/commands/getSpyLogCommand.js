module.exports = {
    name: "bsd",
    execute(socket, messageId) {
        let C2SSpyLogVO = {
            getCmdId: "bsd",
            params: {MID: messageId},
        }
        require('./../data').sendJsonVoSignal(socket, {"commandVO": C2SSpyLogVO, "lockConditionVO": null});
    }
}