const CastleUnitInventory = require("../../../structures/CastleUnitInventory");

module.exports.name = "gui";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    return new CastleUnitInventory(socket.client, params);
}