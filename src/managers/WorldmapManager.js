'use strict'

const BaseManager = require('./BaseManager');
const getWorldmapCommand = require('./../e4kserver/commands/getWorldmapCommand');
const {WaitUntil} = require('./../tools/wait');
const Worldmap = require('../structures/Worldmap');
const WorldmapSector = require('../structures/WorldmapSector');
const Coordinate = require("../structures/Coordinate");

const kingdomIds = [0, 1, 2, 3, 4, 10]

class WorldmapManager extends BaseManager {
    get _socket() {
        if (super._socket[`__worldmap_0_searching_sectors`] == null) {
            for (const id of kingdomIds) {
                super._socket[`__worldmap_${id}_searching_sectors`] = [];
            }
        }
        return super._socket;
    }

    /**
     * Requests the complete worldmap, use {@link getSector} if only part of it is needed
     * @param {number} kingdomId Only kingdoms you have a castle in are valid
     * @returns {Promise<Worldmap>}
     */
    get(kingdomId) {
        return _getWorldmapById(this, this._socket, new Worldmap(this._client, kingdomId), kingdomId);
    };

    /**
     * Requests a 100x100 area of a certain worldmap with center centerX/centerY
     * @param {number} kingdomId Only kingdoms you have a castle in are valid
     * @param {number} centerX X coordinate that will be the center of sector
     * @param {number} centerY Y coordinate that will be the center of sector
     * @returns {Promise<WorldmapSector>} 100x100 WorldmapSector
     */
    getSector(kingdomId, centerX, centerY) {
        return _getWorldmapSector(this, this._socket, kingdomId, centerX, centerY);
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
                } catch (e) {
                    if (e !== 'Received empty area!') {
                        reject(e);
                        return;
                    }
                }
            }
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
            if (!socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_searching`]) {
                socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_searching`] = true;
                const bottomLeft = new Coordinate(socket.client, [x - 50, y - 50]);
                const topRight = new Coordinate(socket.client, [x + 49, y + 49]);
                getWorldmapCommand.execute(socket, kingdomId, bottomLeft, topRight);
            }
            let data = await WaitUntil(socket, `__worldmap_${kingdomId}_specific_sector_${x}_${y}_data`, `__worldmap_${kingdomId}_error`, 2500);
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
            delete socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_searching`];
            delete socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_data`];
            reject(e);
        }
    });
}

module.exports = WorldmapManager