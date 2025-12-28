const {parseMovement} = require("../utils/MovementParser");

const NAME = "mcm";
/** @type {CommandCallback<Movement>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    const movement = parseMCM(client, params);
    if (movement != null) client.movements._add_or_update([movement]);
    require('.').baseExecuteCommand(client, movement, errorCode, params, callbacks);
}

module.exports.mcm = parseMCM;

/**
 * @param {BaseClient} client
 * @param {{A: Object, O: Object[]}} params
 * @returns {Movement}
 */
function parseMCM(client, params) {
    if (params === undefined) return null;
    client.worldMaps._ownerInfoData.parseOwnerInfoArray(params.O);
    if (params.A === undefined) return null;
    return parseMovement(client, params.A);
}