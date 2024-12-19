module.exports.name = "seq";
/**
 * @param {Socket} socket
 * @param {number} equipmentId
 * @param {number} lordId
 * @param {number} lostAndFoundRewardId
 */
module.exports.execute = function (socket, equipmentId, lordId = -1, lostAndFoundRewardId = -1) {
    const C2SSellEquipmentVO = {
        getCmdId: "seq", params: {EID: equipmentId, LID: lordId, LFID: lostAndFoundRewardId},
    }
    require('../data').sendCommandVO(socket, C2SSellEquipmentVO);
}