module.exports.name = "pin";
/** @param {Client} client */
module.exports.execute = function (client) {
    const PingPongVO = {}
    client.socketManager.sendCommand("pinpon", PingPongVO);
}