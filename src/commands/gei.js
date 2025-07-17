const Equipment = require("../structures/Equipment");
const RelicEquipment = require("../structures/RelicEquipment");

const NAME = "gei";
/** @type {CommandCallback<(Equipment | RelicEquipment)[]>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    const equipmentInventory = parseGEI(client, params);
    require('.').baseExecuteCommand(equipmentInventory, errorCode, params, callbacks);
}

/**
 * @param {Client} client
 * @return {Promise<(Equipment | RelicEquipment)[]>}
 */
module.exports.getEquipmentInventory = function (client) {
    const C2SGetEquipmentInventoryVO = {};
    return require('.').baseSendCommand(client, NAME, C2SGetEquipmentInventoryVO, callbacks, (_) => true);
}

module.exports.gei = parseGEI;

/**
 * @param {Client} client
 * @param {{I: [][]}} params
 * @return {(Equipment | RelicEquipment)[]}
 */
function parseGEI(client, params) {
    if (!params || !params.I) return null;
    return params.I.map(e => e[11] === 3 ? new RelicEquipment(client, e) : new Equipment(client, e));
}