const CastleProductionData = require("../../../structures/CastleProductionData");

module.exports.name = "gpa";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    return new CastleProductionData(client, params);
}