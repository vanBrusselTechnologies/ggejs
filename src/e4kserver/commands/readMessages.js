module.exports.name = "rms";
/**
 *
 * @param {Socket} socket
 * @param {number} messageId
 */
module.exports.execute = function (socket, messageId) {
    const C2SReadMessagesVO = {
        getCmdId: "rms", params: {MID: messageId},
    }
    require('../data').sendCommandVO(socket, C2SReadMessagesVO);
}