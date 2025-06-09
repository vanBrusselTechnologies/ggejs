module.exports.name = "sge";
/**
 * @param {Socket} socket
 * @param {number} gemId
 * @param {boolean} isRelicGem
 * @param {number} lostAndFoundRewardId
 */
module.exports.execute = function (socket, gemId, isRelicGem, lostAndFoundRewardId = -1) {
    const C2SSellEquipmentVO = {GID: gemId, RGEM: isRelicGem ? 1 : 0, LFID: lostAndFoundRewardId};
    socket.client.socketManager.sendCommand("sge", C2SSellEquipmentVO);
}