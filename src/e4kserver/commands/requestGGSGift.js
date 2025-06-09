module.exports.name = "rgg";
/**
 * @param {Socket} socket
 * @param {boolean} collectReward
 */
module.exports.execute = function (socket, collectReward = false) {
    const C2SRequestGGSGiftVO = {CR: collectReward ? 1 : 0};
    socket.client.socketManager.sendCommand("rgg", C2SRequestGGSGiftVO);
}