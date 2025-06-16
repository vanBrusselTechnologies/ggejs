module.exports.name = "seq";
/**
 * @param {Client} client
 * @param {number} equipmentId
 * @param {number} lordId
 * @param {number} lostAndFoundRewardId
 */
module.exports.execute = function (client, equipmentId, lordId = -1, lostAndFoundRewardId = -1) {
    const C2SSellEquipmentVO = {EID: equipmentId, LID: lordId, LFID: lostAndFoundRewardId};
    client.socketManager.sendCommand("seq", C2SSellEquipmentVO);
}