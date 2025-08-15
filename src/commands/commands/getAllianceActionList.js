module.exports.name = "all";
/** @param {BaseClient} client */
module.exports.execute = function (client) {
    const C2SAllianceActionListVO = {};
    client.socketManager.sendCommand("all", C2SAllianceActionListVO);
}