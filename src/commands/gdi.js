const Player = require('../structures/Player');

const NAME = "gdi"
/** @type {CommandCallback<Player>[]}*/
const callbacks = []

module.exports.name = NAME;

/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    const player = parseGDI(client, params)
    require('.').baseExecuteCommand(player, errorCode, params, callbacks);
}

/**
 * @param {Client} client
 * @param {number} playerId
 * @return {Promise<Player>}
 */
module.exports.getDetailPlayerInfo = function (client, playerId) {
    const C2SGetDetailPlayerInfo = {PID: playerId};
    return require('.').baseSendCommand(client, NAME, C2SGetDetailPlayerInfo, callbacks, (p) => p?.O?.OID === playerId);
}

module.exports.gdi = parseGDI;

/**
 * @param {Client} client
 * @param {{O: Object}} params
 * @return {Player}
 */
function parseGDI(client, params) {
    if (params.O === undefined) return null;
    client.worldMaps._ownerInfoData.parseOwnerInfo(params["O"]);
    return new Player(client, params);
}