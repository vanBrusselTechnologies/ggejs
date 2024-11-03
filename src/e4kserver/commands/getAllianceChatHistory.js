module.exports.name = "acl";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    let C2SAllianceChatHistoryVO = {
        getCmdId: "acl", params: {}
    }
    require('../data').sendCommandVO(socket, C2SAllianceChatHistoryVO);
}