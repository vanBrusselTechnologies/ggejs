module.exports.name = "irc";
/** @param {BaseClient} client */
module.exports.execute = function (client) {
    const C2SResourceCitizenVO = {};
    client.socketManager.sendCommand("irc", C2SResourceCitizenVO);
}