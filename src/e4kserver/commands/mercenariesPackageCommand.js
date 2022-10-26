module.exports = {
    name: "mpe",
    /**
     * @param {Socket} socket
     * @param {number} missionId
     */
    execute(socket, missionId) {
        let C2SMercenariesPackageVO = {
            getCmdId: "mpe",
            params: {
                MID: missionId,
            },
        }
        require('./../data').sendJsonVoSignal(socket, {"commandVO": C2SMercenariesPackageVO, "lockConditionVO": null});
    }
}