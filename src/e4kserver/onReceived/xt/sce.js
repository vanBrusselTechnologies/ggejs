const Good = require("../../../structures/Good");

module.exports.name = "sce";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Array<[string, number]>} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    for (let g of params) {
        socket.client.clientUserData.setGlobalCurrency(new Good(socket.client, g));
    }
}