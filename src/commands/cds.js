const {parseMovement} = require("../utils/MovementParser");
const {execute: gcu} = require("./onReceived/gcu");

const NAME = "cds";
/** @type {CommandCallback<Movement>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    const movement = parseCDS(client, params);
    if (movement != null) client.movements._add_or_update([movement]);
    require('.').baseExecuteCommand(client, movement, errorCode, params, callbacks);
}

module.exports.cds = parseCDS;

/**
 * @param {BaseClient} client
 * @param {{A: Object, O: Object[], gcu: {C1: number, C2: number}}} params
 * @returns {Movement}
 */
function parseCDS(client, params) {
    if (params === undefined) return null;
    if (params.gcu) gcu(client, 0, params.gcu);
    client.worldMaps._ownerInfoData.parseOwnerInfoArray(params.O);
    if (params.A === undefined) return null;
    return parseMovement(client, params.A);
}