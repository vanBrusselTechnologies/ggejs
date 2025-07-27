const {parseMapObject} = require("../utils/MapObjectParser");

const NAME = "gcl";
/** @type {CommandCallback<{[kId: number]: (CastleMapobject | CapitalMapobject)[]}>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    const playerId = client.clientUserData.playerId;
    client.clientUserData._userData.castleList.ownerId = playerId;
    const ownerInfo = client.worldMaps._ownerInfoData.getOwnerInfo(playerId);
    const castleList = parseGCL(client, params, ownerInfo);
    client.clientUserData._userData.castleList.castles = castleList;
    require('.').baseExecuteCommand(castleList, errorCode, params, callbacks);
}

/**
 * @param {Client} client
 * @return {Promise<{[kId: number]: (CastleMapobject | CapitalMapobject)[]}>}
 */
module.exports.getCastleList = function (client) {
    const C2SGetCastleListVO = {};
    return require('.').baseSendCommand(client, NAME, C2SGetCastleListVO, callbacks, () => true);
}

module.exports.gcl = parseGCL;

/**
 * @param {Client} client
 * @param {{PID: number, C: {KID: number, AI: {AI: [], AOT?: number, CAT?: number, OGC?: number, OGT?: number, TA?: number}[]}[]}} params
 * @param {WorldMapOwnerInfo} ownerInfo
 * @return {{[kId: number]: (CastleMapobject | CapitalMapobject)[]}}
 */
function parseGCL(client, params, ownerInfo) {
    if (!params) return {};
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
    return castleList;
}