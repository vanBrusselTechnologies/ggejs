module.exports.name = "gii";
/** @param {Client} client */
module.exports.execute = function (client) {
    const C2SGetConstructionItemInventoryVO = {};
    client.socketManager.sendCommand("gii", C2SGetConstructionItemInventoryVO);
}