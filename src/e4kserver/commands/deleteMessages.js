module.exports.name = "dms";
/**
 * @param {Client} client
 * @param {number[]} messageIds
 */
module.exports.execute = function (client, messageIds) {
    const C2SDeleteMessageVO = {MIDS: messageIds};
    client.socketManager.sendCommand("dms", C2SDeleteMessageVO);
}