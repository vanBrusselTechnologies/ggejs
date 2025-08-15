const {parseMapObject} = require("../utils/MapObjectParser");

const NAME = "wsp";
/** @type {CommandCallback<WorldMapOwnerInfo>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    const ownerInfo = parseWSP(client, params);
    require('.').baseExecuteCommand(client, ownerInfo, errorCode, params, callbacks);
}

/**
 * @param {BaseClient} client
 * @param {string} playerName
 * @return {Promise<WorldMapOwnerInfo>}
 */
module.exports.searchPlayer = function (client, playerName) {
    const C2SSearchPlayerVO = {PN: playerName};
    return require('.').baseSendCommand(client, NAME, C2SSearchPlayerVO, callbacks, (p) => normalize(p?.gaa?.OI?.[0]?.N ?? "") === normalize(playerName));
}

module.exports.wsp = parseWSP;

/**
 * @param {BaseClient} client
 * @param {{X: number, Y: number, gaa: {AI: [][], OI: Object[]}}} params
 * @return {WorldMapOwnerInfo}
 */
function parseWSP(client, params) {
    if (!(params.gaa?.OI?.length >= 1 && params.gaa?.AI?.length >= 1)) return null;
    const ownerInfo = client.worldMaps._ownerInfoData.parseOwnerInfo(params.gaa.OI[0]);
    parseMapObject(client, params.gaa.AI[0]);
    return ownerInfo;
}

/** @param {string} name */
normalize = (name) => typeof name !== "string" ? "" : name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");