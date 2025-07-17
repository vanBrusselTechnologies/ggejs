const Castle = require("../structures/Castle");

const NAME = "jaa";
/** @type {CommandCallback<Castle>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    const castle = parseJAA(client, params);
    require('.').baseExecuteCommand(castle, errorCode, params, callbacks);
}

/**
 * @param {Client} client
 * @param {InteractiveMapobject} worldMapArea
 * @returns {Promise<Castle>}
 */
module.exports.joinArea = function (client, worldMapArea) {
    const C2SJoinAreaVO = {PY: worldMapArea.position.Y, PX: worldMapArea.position.X, KID: worldMapArea.kingdomId};
    return require('.').baseSendCommand(client, NAME, C2SJoinAreaVO, callbacks, (p) => p?.["gca"]?.["A"]?.[3] === worldMapArea.objectId);
}

module.exports.jaa = parseJAA;

/**
 * @param {Client} client
 * @param {Object} params
 * @return {Castle}
 */
function parseJAA(client, params) {
    if (!params) return null;
    return new Castle(client, params);
}