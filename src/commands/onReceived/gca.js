const CastleBuildings = require("../../structures/CastleBuildingInfo");

module.exports.name = "gca";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    return new CastleBuildings(client, params);
}