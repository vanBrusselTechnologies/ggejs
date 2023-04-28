module.exports = {
    name: "gii",
    execute(socket) {
        let C2SGetConstructionItemInventoryVO = {
            getCmdId: "gii",
            params: {},
        }
        require('./../data').sendJsonVoSignal(socket, {
            "commandVO": C2SGetConstructionItemInventoryVO,
            "lockConditionVO": null
        });
    }
}