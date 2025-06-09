module.exports.name = "seq";
/**
 * @param {Socket} socket
 * @param {number} equipmentId
 * @param {number} lordId
 * @param {number} lostAndFoundRewardId
 */
module.exports.execute = function (socket, equipmentId, lordId = -1, lostAndFoundRewardId = -1) {
    const C2SSellEquipmentVO = {EID: equipmentId, LID: lordId, LFID: lostAndFoundRewardId};
    socket.client.socketManager.sendCommand("seq", C2SSellEquipmentVO);
}