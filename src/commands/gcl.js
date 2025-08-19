const {parseMapObject} = require("../utils/MapObjectParser");

const NAME = "gcl";
/** @type {CommandCallback<{[kId: number]: (CastleMapobject | CapitalMapobject)[]}>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    const castleList = parseGCL(client, params);
    require('.').baseExecuteCommand(client, castleList, errorCode, params, callbacks);
}

/**
 * @param {BaseClient} client
 * @return {Promise<{[kId: number]: (CastleMapobject | CapitalMapobject)[]}>}
 */
module.exports.getCastleList = function (client) {
    const C2SGetCastleListVO = {};
    return require('.').baseSendCommand(client, NAME, C2SGetCastleListVO, callbacks, () => true);
}

module.exports.gcl = parseGCL;

/**
 * @param {BaseClient} client
 * @param {{PID: number, C: {KID: number, AI: {AI: [], AOT?: number, CAT?: number, OGC?: number, OGT?: number, TA?: number}[]}[]}} params
 * @param {WorldMapOwnerInfo} ownerInfo
 * @return {{[kId: number]: (CastleMapobject | CapitalMapobject)[]}}
 */
function parseGCL(client, params, ownerInfo = undefined) {
    if (client.clientUserData.playerId === -1) return {};
    if (!params) return {};
    const playerId = params.PID;
    if (client.clientUserData.playerId === playerId) {
        client.clientUserData._userData.castleList.ownerId = playerId;
        ownerInfo = ownerInfo ?? client.worldMaps._ownerInfoData.getOwnerInfo(playerId);
    }
    const castleList = {};
    for (const castle of params.C) {
        const mapObjects = [];
        for (const data of castle.AI) {
            const mapObject = parseMapObject(client, data.AI);
            if (data.OGT) mapObject.remainingOpenGateTime = data.OGT;
            if (data.OGC) mapObject.openGateCounter = data.OGC;
            if (data.AOT) mapObject.remainingAbandonOutpostTime = data.AOT;
            if (data.TA) mapObject.remainingCooldownAbandonOutpostTime = data.TA;
            if (data.CAT) mapObject.remainingCancelAbandonTime = data.CAT;
            mapObject.ownerInfo = ownerInfo;
            mapObjects.push(mapObject);
        }
        castleList[castle.KID] = mapObjects;
    }
    if (client.clientUserData.playerId === playerId) {
        client.clientUserData._userData.castleList.castles = castleList;
    }
    return castleList;
}