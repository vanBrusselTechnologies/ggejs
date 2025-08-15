module.exports.name = "acl";
/** @param {BaseClient} client */
module.exports.execute = function (client) {
    const C2SAllianceChatHistoryVO = {};
    client.socketManager.sendCommand("acl", C2SAllianceChatHistoryVO);
}