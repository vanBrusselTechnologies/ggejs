module.exports.name = "sie";
/** @param {BaseClient} client */
module.exports.execute = function (client) {
    const C2SSubscriptionsInformationVO = {};
    client.socketManager.sendCommand("sie", C2SSubscriptionsInformationVO);
}