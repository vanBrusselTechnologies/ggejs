module.exports.name = "gdi";
/**
 * @param {Client} client
 * @param {number} playerId
 */
module.exports.execute = function (client, playerId) {
    const C2SGetDetailPlayerInfo = {PID: playerId};
    client.socketManager.sendCommand("gdi", C2SGetDetailPlayerInfo);
}