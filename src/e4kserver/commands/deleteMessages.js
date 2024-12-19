module.exports.name = "dms";
/**
 * @param {Socket} socket
 * @param {number[]} messageIds
 */
module.exports.execute = function (socket, messageIds) {
    const C2SDeleteMessageVO = {
        getCmdId: "dms", params: {MIDS: messageIds}
    }
    require('../data').sendCommandVO(socket, C2SDeleteMessageVO);
}