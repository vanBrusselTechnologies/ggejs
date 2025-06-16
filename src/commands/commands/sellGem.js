module.exports.name = "sge";
/**
 * @param {Client} client
 * @param {number} gemId
 * @param {boolean} isRelicGem
 * @param {number} lostAndFoundRewardId
 */
module.exports.execute = function (client, gemId, isRelicGem, lostAndFoundRewardId = -1) {
    const C2SSellGemVO = {GID: gemId, RGEM: isRelicGem ? 1 : 0, LFID: lostAndFoundRewardId};
    client.socketManager.sendCommand("sge", C2SSellGemVO);
}