module.exports.name = "alb";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    const C2SGetLoginBonusVO = {getCmdId: "alb", params: {},}
    require('../data').sendCommandVO(socket, C2SGetLoginBonusVO);
}