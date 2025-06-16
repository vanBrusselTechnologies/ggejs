const {parseMapObject} = require("../../utils/MapObjectParser");

module.exports.name = "gaa";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{KID:number, AI:[], OI:[]}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (errorCode === 145 || errorCode === 337) {
        client._socket[`__worldMap__error`] = `errorCode_${errorCode}`;
        return;
    }
    if (params == null) return;
    let kId = params.KID;
    if (!params.AI || params.AI.length === 0) {
        if (kId == null) return;
        client._socket[`__worldMap_${kId}_empty`] = {worldMapAreas: []};
        return;
    }
    client.worldMaps._ownerInfoData.parseOwnerInfoArray(params.OI);
    if (kId == null) {
        kId = parseMapObject(client, params.AI.find(i => i.length > 4))?.kingdomId;
        if (kId == null) return;
    }

    /**  @type {{x: number, y: number}[]} */
    const searchingSectors = client._socket[`__worldMap_${kId}_searching_sectors`];
    if (searchingSectors === undefined || searchingSectors.length === 0) return;

    let _worldMapAreas = parseWorldMapAreas(client, params.AI);
    /** @type {{x: number, y: number}} */
    const areaCenter = getCenterOfWorldMapAreas(_worldMapAreas);
    let foundRequest = false;
    for (let i = searchingSectors.length - 1; i >= 0; i--) {
        const sectorCenter = searchingSectors[i];
        const distance = getDistance(areaCenter, sectorCenter);
        if (distance < 2.5 || (distance < 10 && (areaCenter.x > 1000 || areaCenter.y > 1000))) {
            client._socket[`__worldMap_${kId}_searching_sectors`].splice(i, 1);
            const str = `__worldMap_${kId}_specific_sector_${sectorCenter.x}_${sectorCenter.y}`;
            client._socket[`${str}_data`] = {worldMapAreas: _worldMapAreas};
            foundRequest = true;
        }
    }
    if (!foundRequest) {
        const sorted = searchingSectors.sort((a, b) => {
            return getDistance(a, areaCenter) - getDistance(b, areaCenter);
        });
        const sectorCenter = sorted[0];
        if (getDistance(sectorCenter, areaCenter) < 50) {
            const i = searchingSectors.indexOf(sectorCenter);
            client._socket[`__worldMap_${kId}_searching_sectors`].splice(i, 1);
            const str = `__worldMap_${kId}_specific_sector_${sectorCenter.x}_${sectorCenter.y}`;
            client._socket[`${str}_data`] = {worldMapAreas: _worldMapAreas};
        }
    }

    _worldMapAreas = null;
}

/**
 * @param {Client} client
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

/**
 * @param {BasicMapobject[]} worldMapAreas
 * @returns {{x:number, y: number}}
 */
function getCenterOfWorldMapAreas(worldMapAreas) {
    let lowX = 10000;
    let highX = -10000;
    let lowY = 10000;
    let highY = -10000;
    for (const wmA of worldMapAreas) {
        lowX = Math.min(lowX, wmA.position.X);
        highX = Math.max(highX, wmA.position.X);
        lowY = Math.min(lowY, wmA.position.Y);
        highY = Math.max(highY, wmA.position.Y);
    }
    const centerX = (lowX + highX) / 2;
    const centerY = (lowY + highY) / 2;
    return {x: centerX, y: centerY};
}

/**
 * @param {{x:number, y: number}} coord1
 * @param {{x:number, y: number}} coord2
 */
function getDistance(coord1, coord2) {
    return Math.sqrt(Math.pow(coord1.x - coord2.x, 2) + Math.pow(coord1.y - coord2.y, 2));
}