module.exports.name = "gii";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    const C2SGetConstructionItemInventoryVO = {};
    socket.client.socketManager.sendCommand("gii", C2SGetConstructionItemInventoryVO);
}