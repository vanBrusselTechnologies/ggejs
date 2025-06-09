module.exports.name = "txc";
/**
 * @param {Socket} socket
 * @param {number} taxRemaining
 */
module.exports.execute = function (socket, taxRemaining = 29) {
    const C2SCollectTaxVO = {TR: taxRemaining};
    socket.client.socketManager.sendCommand("txc", C2SCollectTaxVO);
}