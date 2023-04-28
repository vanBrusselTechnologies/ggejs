module.exports = {
    name: "gbl",
    execute(socket) {
        let C2SBookmarksGetListVO = {
            getCmdId: "gbl",
            params: {},
        }
        require('./../data').sendJsonVoSignal(socket, {"commandVO": C2SBookmarksGetListVO, "lockConditionVO": null});
    }
}