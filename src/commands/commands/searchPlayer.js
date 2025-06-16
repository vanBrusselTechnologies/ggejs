module.exports.name = "wsp";
/**
 * @param {Client} client
 * @param {string} playerName
 */
module.exports.execute = function (client, playerName) {
    const C2SSearchPlayerVO = {PN: playerName};
    client.socketManager.sendCommand("wsp", C2SSearchPlayerVO);
}