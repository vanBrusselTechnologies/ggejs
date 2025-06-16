module.exports.name = "bsd";
/**
 * @param {Client} client
 * @param {number} messageId
 */
module.exports.execute = function (client, messageId) {
    const C2SSpyLogVO = {MID: messageId};
    client.socketManager.sendCommand("bsd", C2SSpyLogVO);
}