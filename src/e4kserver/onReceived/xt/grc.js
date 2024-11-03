const CastleResourceStorage = require("../../../structures/CastleResourceStorage");

module.exports.name = "grc";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    return new CastleResourceStorage(socket.client, params);
}