module.exports.name = "rgg";
/**
 * @param {Client} client
 * @param {boolean} collectReward
 */
module.exports.execute = function (client, collectReward = false) {
    const C2SRequestGGSGiftVO = {CR: collectReward ? 1 : 0};
    client.socketManager.sendCommand("rgg", C2SRequestGGSGiftVO);
}