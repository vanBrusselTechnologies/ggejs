module.exports.name = "gei";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    const C2SGetEquipmentInventoryVO = {};
    socket.client.socketManager.sendCommand("gei", C2SGetEquipmentInventoryVO);
}