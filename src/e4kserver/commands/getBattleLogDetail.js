module.exports.name = "bld";
/**
 * @param {Socket} socket
 * @param {number} battleLogId
 */
module.exports.execute = function (socket, battleLogId) {
    const C2SBattleLogDetailVO = {
        getCmdId: "bld", params: {LID: battleLogId},
    }
    require('../data').sendCommandVO(socket, C2SBattleLogDetailVO);
}