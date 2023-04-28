module.exports = {
    name: "dms",
    execute(socket, messageId) {
        let C2SDeleteMessageVO = {
            getCmdId: "dms",
            params: {MID: messageId},
        }
        require('./../data').sendJsonVoSignal(socket, {"commandVO": C2SDeleteMessageVO, "lockConditionVO": null});
    }
}