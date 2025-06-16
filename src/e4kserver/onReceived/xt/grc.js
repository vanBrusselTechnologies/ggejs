const CastleResourceStorage = require("../../../structures/CastleResourceStorage");

module.exports.name = "grc";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    return new CastleResourceStorage(client, params);
}