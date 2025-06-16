module.exports.name = "acl";
/** @param {Client} client */
module.exports.execute = function (client) {
    const C2SAllianceChatHistoryVO = {};
    client.socketManager.sendCommand("acl", C2SAllianceChatHistoryVO);
}