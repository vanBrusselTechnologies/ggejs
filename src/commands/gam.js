const {parseMovement} = require("../utils/MovementParser");

const NAME = "gam";
/** @type {CommandCallback<Movement[]>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    const movements = parseGAM(client, params);
    client.movements._add_or_update(movements);
    require('.').baseExecuteCommand(client, movements, errorCode, params, callbacks);
}

module.exports.gam = parseGAM;

/**
 * @param {BaseClient} client
 * @param {{M: {M:{MID: number, T: number}}[], O: Object[]}} params
 * @returns {Movement[]}
 */
function parseGAM(client, params) {
    if (params === undefined) return [];
    client.worldMaps._ownerInfoData.parseOwnerInfoArray(params.O);
    /** @type {Movement[]} */
    const movements = [];
    const movementObjects = (params.M ?? []).sort((m1, m2) => m1.M.MID - m2.M.MID);
    for (const _movObj of movementObjects) {
        if (!_movObj) continue;
        const _movement = parseMovement(client, _movObj);
        if (_movement != null) movements.push(_movement);
    }
    return movements;
}