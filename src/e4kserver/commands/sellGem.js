module.exports.name = "sge";
/**
 * @param {Socket} socket
 * @param {number} gemId
 * @param {boolean} isRelicGem
 * @param {number} lostAndFoundRewardId
 */
module.exports.execute = function (socket, gemId, isRelicGem, lostAndFoundRewardId = -1) {
    let C2SSellEquipmentVO = {
        getCmdId: "sge", params: {GID: gemId, RGEM: isRelicGem ? 1 : 0, LFID: lostAndFoundRewardId},
    }
    require('../data').sendCommandVO(socket, C2SSellEquipmentVO);
}