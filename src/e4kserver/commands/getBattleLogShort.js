module.exports.name = "bls";
/**
 * @param {Socket} socket
 * @param {number} messageId
 */
module.exports.execute = function (socket, messageId) {
    const C2SBattleLogShortVO = {MID: messageId};
    socket.client.socketManager.sendCommand("bls", C2SBattleLogShortVO);
}