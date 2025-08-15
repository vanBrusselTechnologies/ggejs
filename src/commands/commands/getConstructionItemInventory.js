module.exports.name = "gii";
/** @param {BaseClient} client */
module.exports.execute = function (client) {
    const C2SGetConstructionItemInventoryVO = {};
    client.socketManager.sendCommand("gii", C2SGetConstructionItemInventoryVO);
}