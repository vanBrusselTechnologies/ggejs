module.exports = {
    name: "gei",
    execute(socket) {
        let C2SGetEquipmentInventoryVO = {
            getCmdId: "gei",
            params: {},
        }
        require('./../data').sendJsonVoSignal(socket, {
            "commandVO": C2SGetEquipmentInventoryVO,
            "lockConditionVO": null
        });
    }
}