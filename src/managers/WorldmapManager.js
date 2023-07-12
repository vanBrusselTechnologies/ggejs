'use strict'

const BaseManager = require('./BaseManager');
const getWorldmapCommand = require('./../e4kserver/commands/getWorldmapCommand');
const {WaitUntil} = require('./../tools/wait');
const Worldmap = require('../structures/Worldmap');
const WorldmapSector = require('../structures/WorldmapSector');
const Coordinate = require("../structures/Coordinate");

const cacheSec = 30;

const kingdomIds = [0, 1, 2, 3, 4, 10]

class WorldmapManager extends BaseManager {
    _worldmapCaches = {};

    /** @param {Client} client */
    constructor(client) {
        super(client);
        for (const id of kingdomIds) {
            client._socket[`__worldmap_${id}_searching_sectors`] = [];
            this._worldmapCaches[id] = {date: new Date(0), worldmap: new Worldmap(this._client, id)};
        }
    }

    /**
     *
     * @param {number} kingdomId
     * @param {number} noCache
     * @returns {Promise<Worldmap>}
     */
    get(kingdomId, noCache = false) {
        return new Promise(async (resolve, reject) => {
            try {
                if (noCache || !isWorldmapCached(this, kingdomId)) await _getWorldmapById(this, this._socket, this._worldmapCaches[kingdomId]?.worldmap, kingdomId);
                resolve(this._worldmapCaches[kingdomId]?.worldmap);
            } catch (e) {
                reject(e);
            }
        })
    };

    /**
     *
     * @param {number} kingdomId
     * @param {number} positionX
     * @param {number} positionY
     * @returns {Promise<WorldmapSector>} 100x100 WorldmapSector
     */
    getSector(kingdomId, positionX, positionY) {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await _getWorldmapSector(this, this._socket, kingdomId, positionX, positionY));
            } catch (e) {
                reject(e);
            }
        })
    }
}

/**
 *
 * @param {WorldmapManager} thisManager
 * @param {Socket} socket
 * @param {Worldmap} _worldmap
 * @param {number} kingdomId
 * @returns {Promise<Worldmap>}
 */
function _getWorldmapById(thisManager, socket, _worldmap, kingdomId) {
    if (!_worldmap) return new Promise((resolve, reject) => reject("missing worldmap"));
    _worldmap._clear();
    return new Promise(async (resolve, reject) => {
        try {
            let worldmapSize = 15;
            for (let i = 0; i < worldmapSize * worldmapSize; i++) {
                if (!socket["__connected"]) break;
                let col = Math.floor(i / worldmapSize) * 100 + 50;
                let row = i % worldmapSize * 100 + 50;
                try {
                    let sector = await _getWorldmapSector(thisManager, socket, kingdomId, col, row);
                    _worldmap._addAreaMapObjects(sector.mapobjects);
                    _worldmap._addPlayers(sector.players);
                    sector = null;
                }catch (e) {
                    if(e !== 'Received empty area!'){
                        reject(e);
                        return;
                    }
                }
            }
            thisManager._worldmapCaches[kingdomId].date = new Date(Date.now() + cacheSec * 1000);
            thisManager._worldmapCaches[kingdomId].worldmap = _worldmap;
            resolve(_worldmap);
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Returns a 100x100 worldmapsector
 * @param {WorldmapManager} thisManager
 * @param {Socket} socket
 * @param {number} kingdomId
 * @param {number} x
 * @param {number} y
 * @param {number} tries
 * @returns {Promise<WorldmapSector>}
 */
function _getWorldmapSector(thisManager, socket, kingdomId, x, y, tries = 0) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!socket["__connected"]) reject('Client disconnected');
            socket[`__worldmap_${kingdomId}_searching_sectors`].push({x: x, y: y});
            socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_found`] = false;
            if (!socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_searching`]) {
                socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_searching`] = true;
                const bottomLeft = new Coordinate(socket.client, [x - 50, y - 50]);
                const topRight = new Coordinate(socket.client, [x + 49.99, y + 49.99]);
                getWorldmapCommand.execute(socket, kingdomId, bottomLeft, topRight);
            }
            await WaitUntil(socket, `__worldmap_${kingdomId}_specific_sector_${x}_${y}_found`, `__worldmap_${kingdomId}_error`);
            let data = socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_data`];
            delete socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_found`];
            delete socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_searching`];
            delete socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_data`];
            if (!data) {
                if (tries >= 3) {
                    new WorldmapSector(socket.client, kingdomId, {players: [], worldmapAreas: []});
                    return;
                }
                let sector = await _getWorldmapSector(thisManager, socket, kingdomId, x, y, tries + 1);
                resolve(sector);
                return;
            }
            let worldmapSector = new WorldmapSector(socket.client, kingdomId, data);
            resolve(worldmapSector);
        } catch (e) {
            delete socket[`__worldmap_${kingdomId}_error`];
            delete socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_found`];
            delete socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_searching`];
            delete socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_data`];
            reject(e);
        }
    });
}

/**
 *
 * @param {WorldmapManager} thisManager
 * @param {number} kingdomId
 * @returns {boolean}
 */
function isWorldmapCached(thisManager, kingdomId) {
    return thisManager._worldmapCaches[kingdomId].date.getTime() >= Date.now();
}

module.exports = WorldmapManager