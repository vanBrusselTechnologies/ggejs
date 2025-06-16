module.exports.name = "rms";
/**
 * @param {Client} client
 * @param {number} messageId
 */
module.exports.execute = function (client, messageId) {
    const C2SReadMessagesVO = {MID: messageId};
    client.socketManager.sendCommand("rms", C2SReadMessagesVO);
}