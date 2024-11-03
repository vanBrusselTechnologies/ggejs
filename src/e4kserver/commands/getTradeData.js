module.exports.name = "mmn";
/**
 * @param {Socket} socket
 * @param {number} messageId
 */
module.exports.execute = function (socket, messageId) {
    let C2SMarketCarriageNotifyVO = {
        getCmdId: "mmn", params: {MID: messageId},
    }
    require('../data').sendCommandVO(socket, C2SMarketCarriageNotifyVO);
}