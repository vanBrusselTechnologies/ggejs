const {parseMapObject} = require("../utils/MapObjectParser");

const NAME = "gaa";
/** @type {CommandCallback<Mapobject[]>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    const mapObjects = parseGAA(client, params);
    require('.').baseExecuteCommand(client, mapObjects, errorCode, params, callbacks);
}

/**
 * Requests all Mapobjects for the area between topX and bottomY
 * @param {BaseClient} client
 * @param {number} kingdomId
 * @param {Coordinate} bottomLeftCorner
 * @param {Coordinate} topRightCorner
 * @return {Promise<Mapobject[]>}
 */
module.exports.getArea = function (client, kingdomId, bottomLeftCorner, topRightCorner) {
    const C2SGetAreaVO = {
        KID: kingdomId, AX1: bottomLeftCorner.X, AY1: bottomLeftCorner.Y, AX2: topRightCorner.X, AY2: topRightCorner.Y
    };
    return require('.').baseSendCommand(client, NAME, C2SGetAreaVO, callbacks, (p) => {
        if (p?.KID === kingdomId) {
            if (p.AI?.length === 0) return true;
            const stats = getRawAreaStats(p.AI);
            if (bottomLeftCorner.X <= stats.minX && topRightCorner.X >= stats.maxX && bottomLeftCorner.Y <= stats.minY && topRightCorner.Y >= stats.maxY) return true
        }
        return false;
    });
}

module.exports.gaa = parseGAA;

/**
 * @param {BaseClient} client
 * @param {Object} params
 * @return {Mapobject[]}
 */
function parseGAA(client, params) {
    if (params == null) return null;
    if (!params.AI || params.AI.length === 0) {
        if (params.KID == null) return null;
        return [];
    }
    client.worldMaps._ownerInfoData.parseOwnerInfoArray(params.OI);
    if (params.KID == null) {
        const kId = parseMapObject(client, params.AI.find(i => i.length > 4))?.kingdomId;
        if (kId == null) return null;
    }
    return parseWorldMapAreas(client, params.AI);
}

/**
 * @param {BaseClient} client
 * @param {[]} _data
 */
function parseWorldMapAreas(client, _data) {
    /** @type {Mapobject[]} */
    const worldMapAreas = [];
    for (const data of (_data ?? [])) {
        worldMapAreas.push(parseMapObject(client, data));
    }
    return worldMapAreas;
}

/**@param {[][]} areaInfo */
function getRawAreaStats(areaInfo) {
    const minX = Math.min(...areaInfo.filter(d => d != null && d.length > 2).map(d => d[1]));
    const maxX = Math.max(...areaInfo.filter(d => d != null && d.length > 2).map(d => d[1]));
    const minY = Math.min(...areaInfo.filter(d => d != null && d.length > 2).map(d => d[2]));
    const maxY = Math.max(...areaInfo.filter(d => d != null && d.length > 2).map(d => d[2]));
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    return {minX, maxX, minY, maxY, centerX, centerY};
}