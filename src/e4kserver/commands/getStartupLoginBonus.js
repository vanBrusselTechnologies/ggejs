module.exports.name = "sli";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    let C2SStartupLoginBonusVO = {
        getCmdId: "sli", params: {},
    }
    require('../data').sendCommandVO(socket, C2SStartupLoginBonusVO);
}