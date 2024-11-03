const CastleBuildingStorage = require("../../../structures/CastleBuildingStorage");

module.exports.name = "sin";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {[]} params
 */
module.exports.execute = function (socket, errorCode, params) {
    return new CastleBuildingStorage(socket.client, params);
}