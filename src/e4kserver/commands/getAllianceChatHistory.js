module.exports.name = "acl";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    const C2SAllianceChatHistoryVO = {getCmdId: "acl", params: {}}
    require('../data').sendCommandVO(socket, C2SAllianceChatHistoryVO);
}