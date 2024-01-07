const Good = require("../../../structures/Good");

module.exports.name = "sce";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    for (let g of params) {
        socket.client.clientUserData.globalCurrencies = new Good(socket.client, g);
    }
}