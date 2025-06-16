module.exports.name = "irc";
/** @param {Client} client */
module.exports.execute = function (client) {
    const C2SResourceCitizenVO = {};
    client.socketManager.sendCommand("irc", C2SResourceCitizenVO);
}