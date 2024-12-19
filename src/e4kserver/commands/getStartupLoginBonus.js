module.exports.name = "sli";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    const C2SStartupLoginBonusVO = {getCmdId: "sli", params: {},}
    require('../data').sendCommandVO(socket, C2SStartupLoginBonusVO);
}