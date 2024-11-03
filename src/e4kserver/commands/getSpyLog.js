module.exports.name = "bsd";
/**
 * @param {Socket} socket
 * @param {number} messageId
 */
module.exports.execute = function (socket, messageId) {
    let C2SSpyLogVO = {
        getCmdId: "bsd", params: {MID: messageId},
    }
    require('../data').sendCommandVO(socket, C2SSpyLogVO);
}