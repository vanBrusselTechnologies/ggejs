module.exports.name = "gei";
/** @param {Client} client */
module.exports.execute = function (client) {
    const C2SGetEquipmentInventoryVO = {};
    client.socketManager.sendCommand("gei", C2SGetEquipmentInventoryVO);
}