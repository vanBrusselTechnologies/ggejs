module.exports.name = "acl";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    const C2SAllianceChatHistoryVO = {};
    socket.client.socketManager.sendCommand("acl", C2SAllianceChatHistoryVO);
}