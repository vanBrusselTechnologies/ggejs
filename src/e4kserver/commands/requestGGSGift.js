module.exports.name = "rgg";
/**
 * @param {Socket} socket
 * @param {0|1} collectReward
 */
module.exports.execute = function (socket, collectReward = 0) {
    const C2SRequestGGSGiftVO = {
        getCmdId: "rgg", params: {CR: collectReward}
    }
    require('../data').sendCommandVO(socket, C2SRequestGGSGiftVO);
}