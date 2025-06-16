module.exports.name = "sne";
/** @param {Client} client */
module.exports.execute = function (client) {
    const C2SShowMessagesVO = {}
    client.socketManager.sendCommand("sne", C2SShowMessagesVO);
}