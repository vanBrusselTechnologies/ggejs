const CastleUnitInventory = require("../../structures/CastleUnitInventory");

module.exports.name = "gui";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    return new CastleUnitInventory(client, params);
}