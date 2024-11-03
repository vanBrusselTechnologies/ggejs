const CastleProductionData = require("../../../structures/CastleProductionData");

module.exports.name = "gpa";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    return new CastleProductionData(socket.client, params);
}