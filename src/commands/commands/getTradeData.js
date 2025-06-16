module.exports.name = "mmn";
/**
 * @param {Client} client
 * @param {number} messageId
 */
module.exports.execute = function (client, messageId) {
    const C2SMarketCarriageNotifyVO = {MID: messageId};
    client.socketManager.sendCommand("mmn", C2SMarketCarriageNotifyVO);
}