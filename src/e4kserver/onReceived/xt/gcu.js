const Good = require("../../../structures/Good");
module.exports.name = "gcu";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{C1: number, C2: number}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    socket.client.clientUserData.globalCurrencies = new Good(socket.client, ["C1", params.C1]);
    socket.client.clientUserData.globalCurrencies = new Good(socket.client, ["C2", params.C2]);
}