const CastleBuildingStorage = require("../../structures/CastleBuildingStorage");

module.exports.name = "sin";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {[]} params
 */
module.exports.execute = function (client, errorCode, params) {
    return new CastleBuildingStorage(client, params);
}