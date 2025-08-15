const CastleBuildingInfo = require("../../structures/CastleBuildingInfo");

module.exports.name = "gca";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    return new CastleBuildingInfo(client, params);
}