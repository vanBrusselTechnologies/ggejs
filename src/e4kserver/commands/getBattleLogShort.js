module.exports.name = "bls";
/**
 * @param {Socket} socket
 * @param {number} messageId
 */
module.exports.execute = function (socket, messageId) {
    const C2SBattleLogShortVO = {
        getCmdId: "bls", params: {MID: messageId},
    }
    require('../data').sendCommandVO(socket, C2SBattleLogShortVO);
}