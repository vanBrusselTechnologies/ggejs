module.exports.name = "txs";
/**
 * @param {Socket} socket
 * @param {number} taxType
 * @param {number} taxes
 */
module.exports.execute = function (socket, taxType, taxes = 3) {
    const C2SStartCollectTaxVO = {TT: taxType, TX: taxes};
    socket.client.socketManager.sendCommand("txs", C2SStartCollectTaxVO);
}