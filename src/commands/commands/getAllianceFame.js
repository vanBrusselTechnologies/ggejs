module.exports.name = "afa";
/** @param {Client} client */
module.exports.execute = function (client) {
    const C2SAllianceGetFameVO = {};
    client.socketManager.sendCommand("afa", C2SAllianceGetFameVO);
}