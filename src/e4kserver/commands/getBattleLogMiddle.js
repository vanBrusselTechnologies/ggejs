module.exports.name = "blm";
/**
 * @param {Socket} socket
 * @param {number} battleLogId
 */
module.exports.execute = function (socket, battleLogId) {
    const C2SBattleLogMiddleVO = {
        getCmdId: "blm", params: {LID: battleLogId},
    }
    require('../data').sendCommandVO(socket, C2SBattleLogMiddleVO);
}