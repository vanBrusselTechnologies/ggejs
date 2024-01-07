const {parseMapObject} = require("../../../utils/MapObjectParser");
const Player = require("./../../../structures/Player");

module.exports.name = "gaa";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{KID:number, AI:[], OI:[]}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (errorCode === 337) return;
    if (params == null) return;
    let kId = params.KID;
    if (!params.AI || params.AI.length === 0) {
        if (kId == null) return;
        socket[`__worldmap_${kId}_error`] = 'Received empty area!';
        return;
    }
    if (kId == null) {
        kId = parseWorldmapAreas(socket.client, params.AI.slice(0, 1))[0].kingdomId;
        if (kId == null) return;
    }

    /**  @type {{x: number, y: number}[]} */
    const searchingSectors = socket[`__worldmap_${kId}_searching_sectors`];
    if (searchingSectors.length === 0) return;

    let _worldmapAreas = parseWorldmapAreas(socket.client, params.AI);
    let _players = parsePlayers(socket.client, params.OI);
    /** @type {{x: number, y: number}} */
    const areaCenter = getCenterOfWorldmapAreas(_worldmapAreas)
    let foundRequest = false;
    for (let i = searchingSectors.length - 1; i >= 0; i--) {
        const sectorCenter = searchingSectors[i];
        const distance = getDistance(areaCenter, sectorCenter);
        if (distance < 2.5 || (distance < 10 && (areaCenter.x > 1000 || areaCenter.y > 1000))) {
            socket[`__worldmap_${kId}_searching_sectors`].splice(i, 1);
            const str = `__worldmap_${kId}_specific_sector_${sectorCenter.x}_${sectorCenter.y}`
            socket[`${str}_data`] = {worldmapAreas: _worldmapAreas, players: _players};
            foundRequest = true;
        }
    }
    if (!foundRequest) {
        const sorted = searchingSectors.sort((a, b) => {
            return getDistance(a, areaCenter) - getDistance(b, areaCenter);
        })
        const sectorCenter = sorted[0];
        if (getDistance(sectorCenter, areaCenter) < 50) {
            const i = searchingSectors.indexOf(sectorCenter)
            socket[`__worldmap_${kId}_searching_sectors`].splice(i, 1);
            const str = `__worldmap_${kId}_specific_sector_${sectorCenter.x}_${sectorCenter.y}`
            socket[`${str}_data`] = {worldmapAreas: _worldmapAreas, players: _players};
        }
    }

    _worldmapAreas = null;
    _players = null;
}

/**
 * @param {Client} client
 * @param {[]} _data
 * @returns {Mapobject[]}
 */
function parseWorldmapAreas(client, _data) {
    const worldmapAreas = [];
    for (const data of _data) {
        worldmapAreas.push(parseMapObject(client, data))
    }
    return worldmapAreas;
}

/**
 *
 * @param {Client} client
 * @param {[]} _data
 * @returns {Player[]}
 */
function parsePlayers(client, _data) {
    const players = [];
    for (let i in _data) {
        let data = {O: _data[i]};
        let _player = new Player(client, data);
        players.push(_player);
    }
    return players;
}

/**
 *
 * @param {Mapobject[]} worldmapAreas
 * @returns {{x:number, y: number}}
 */
function getCenterOfWorldmapAreas(worldmapAreas) {
    let lowX = 10000;
    let highX = -10000;
    let lowY = 10000;
    let highY = -10000;
    for (let wmA of worldmapAreas) {
        lowX = Math.min(lowX, wmA.position.X);
        highX = Math.max(highX, wmA.position.X);
        lowY = Math.min(lowY, wmA.position.Y);
        highY = Math.max(highY, wmA.position.Y);
    }
    const centerX = (lowX + highX) / 2;
    const centerY = (lowY + highY) / 2;
    return {x: centerX, y: centerY}
}

/**
 * @param {{x:number, y: number}} coord1
 * @param {{x:number, y: number}} coord2
 */
function getDistance(coord1, coord2) {
    return Math.sqrt(Math.pow(coord1.x - coord2.x, 2) + Math.pow(coord1.y - coord2.y, 2));
}