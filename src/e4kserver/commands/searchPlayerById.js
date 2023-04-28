module.exports = {
    name: "gdi",
    /**
     * @param {Socket} socket
     * @param {number} playerId
     */
    execute(socket, playerId) {
        if (playerId == null) return;
        let C2SGetDetailPlayerInfo = {
            params: {
                PID: playerId,
            },
            getCmdId: "gdi",
        }
        require('./../data').sendJsonVoSignal(socket, {"commandVO": C2SGetDetailPlayerInfo, "lockConditionVO": null});
    }
}