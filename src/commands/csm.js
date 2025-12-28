const {parseMovement} = require("../utils/MovementParser");

const NAME = "csm";
/** @type {CommandCallback<SpyMovement>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    const spyMovement = parseCSM(client, params);
    if (spyMovement != null) client.movements._add_or_update([spyMovement]);
    require('.').baseExecuteCommand(client, spyMovement, errorCode, params, callbacks);
}

/**
 * @param {BaseClient} client
 * @param {InteractiveMapobject} source
 * @param {Mapobject | CastlePosition} target
 * @param {number} spyCount
 * @param {number} spyTypeId
 * @param {number} spyEffect
 * @param {Horse} horse
 * @return {Promise<SpyMovement>}
 */
module.exports.createSpyMovement = function (client, source, target, spyCount, spyTypeId, spyEffect, horse = null) {
    const C2SCreateSpyMovementVO = {
        SID: source.objectId,
        TX: target.position.X,
        TY: target.position.Y,
        SC: spyCount,
        ST: spyTypeId,
        SE: spyEffect,
        HBW: horse?.wodId ?? -1,
        KID: source.kingdomId,
        PTT: horse?.isPegasusHorse ? 1 : 0,
        SD: 0,
    };
    return require('.').baseSendCommand(client, NAME, C2SCreateSpyMovementVO, callbacks, _ => true);
}

module.exports.csm = parseCSM;

/**
 * @param {BaseClient} client
 * @param {{A: Object, O: Object[]}} params
 * @returns {SpyMovement}
 */
function parseCSM(client, params) {
    if (params === undefined) return null;
    client.worldMaps._ownerInfoData.parseOwnerInfoArray(params.O);
    if (params.A === undefined) return null;
    return parseMovement(client, params.A);
}