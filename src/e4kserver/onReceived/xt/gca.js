const CastleBuildings = require("../../../structures/CastleBuildingInfo");

module.exports.name = "gca";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    return new CastleBuildings(socket.client, params);
}