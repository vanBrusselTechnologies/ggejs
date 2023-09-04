module.exports = {
    name: "gbl",
    execute(socket) {
        let C2SBookmarkGetListVO = {
            getCmdId: "gbl",
            params: {},
        }
        require('./../data').sendJsonVoSignal(socket, {"commandVO": C2SBookmarkGetListVO, "lockConditionVO": null});
    }
}