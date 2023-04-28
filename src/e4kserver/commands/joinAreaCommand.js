module.exports = {
    name: "jaa",
    execute(socket, worldmapArea) {
        let C2SJoinAreaVO = {
            getCmdId: "jaa",
            params: {
                PY: worldmapArea.position.Y,
                PX: worldmapArea.position.X,
                KID: worldmapArea.kingdomId,
            },
        }
        require('./../data').sendJsonVoSignal(socket, {"commandVO": C2SJoinAreaVO, "lockConditionVO": null});
    }
}