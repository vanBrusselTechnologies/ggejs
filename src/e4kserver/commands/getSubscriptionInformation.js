module.exports.name = "sie";
/** @param {Client} client */
module.exports.execute = function (client) {
    const C2SSubscriptionsInformationVO = {};
    client.socketManager.sendCommand("sie", C2SSubscriptionsInformationVO);
}