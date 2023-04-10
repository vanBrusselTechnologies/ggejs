'use strict'

const BaseManager = require('./BaseManager');
const getWorldmapCommand = require('./../e4kserver/commands/getWorldmapCommand');
const {WaitUntil} = require('./../tools/wait');
const Worldmap = require('../structures/Worldmap');
const WorldmapSector = require('../structures/WorldmapSector');

const worldmapSizes = [13, 11];
const worldmapLeftTop = [0, 0];
let worldmapRightBottom = [1000, 1000];
const cacheSec = 30;

class WorldmapManager extends BaseManager {
    _worldmapCaches = {
        0: {date: new Date(0), worldmap: new Worldmap(this._client, 0)},
        2: {date: new Date(0), worldmap: new Worldmap(this._client, 2)},
        1: {date: new Date(0), worldmap: new Worldmap(this._client, 1)},
        3: {date: new Date(0), worldmap: new Worldmap(this._client, 3)},
        4: {date: new Date(0), worldmap: new Worldmap(this._client, 4)},
        10: {date: new Date(0), worldmap: new Worldmap(this._client, 10)}
    };

    /**
     *
     * @param {Client} client
     */
    constructor(client) {
        super(client)
        for (let i = -1; i <= 4; i++)
            client._socket[`__worldmap_${i}_found`] = false;
        client._socket[`__worldmap_${10}_found`] = false;
    }

    /**
     *
     * @param {number} kingdomId
     * @returns {Promise<Worldmap>}
     */
    get(kingdomId) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!isWorldmapCached(this, kingdomId))
                    await _getWorldmapById(this, this._client._socket, this._worldmapCaches[kingdomId]?.worldmap, kingdomId);
                resolve(this._worldmapCaches[kingdomId]?.worldmap);
            } catch (e) {
                reject(e);
            }
        })
    };

    /**
     *
     * @param {number} kingdomId
     * @param {number} sectorX an integer between 0-9
     * @param {number} sectorY an integer between 0-9
     * @returns {Promise<WorldmapSector>} 100x100 WorldmapSector
     */
    getSector(kingdomId, sectorX, sectorY) {
        return new Promise(async (resolve, reject) => {
            try {
                const sector = await _getWorldmapSector(this, this._client._socket, kingdomId, sectorX, sectorY);
                resolve(sector);
            } catch (e) {
                reject(e);
            }
        })
    }

    /**
     *
     * @param {number} kingdomId
     * @param {Coordinate} coordinate
     * @return {Promise<WorldmapSector>};
     */
    getSectorsAround(kingdomId, coordinate){
        return new Promise(async (resolve, reject)=> {
            try {
                let sectorXCastle = Math.floor(coordinate.X / 100);
                let sectorYCastle = Math.floor(coordinate.Y / 100);
                let xArray = [sectorXCastle - 1, sectorXCastle, sectorXCastle + 1];
                let yArray = [sectorYCastle - 1, sectorYCastle, sectorYCastle + 1];
                /** @type {WorldmapSector} */
                let worldmap = await this.getSector(kingdomId, sectorXCastle, sectorYCastle);
                for (let x of xArray) {
                    for (let y of yArray) {
                        if (x === sectorXCastle && y === sectorYCastle) continue;
                        let sector = await this.getSector(kingdomId, x, y);
                        worldmap.combine(sector);
                    }
                }
                resolve(worldmap);
            }catch (e) {
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
            let worldmapSize = kingdomId === 0 ? worldmapSizes[0] : worldmapSizes[1];
            worldmapRightBottom = [worldmapSize * 100, worldmapSize * 100];
            socket[`__worldmap_${kingdomId}_sectors_found`] = 0;
            socket[`__get_worldmap_${kingdomId}_error`] = "";
            let lastJ = 0;
            for (let i = 0; i < worldmapSize * worldmapSize; i++) {
                if(!socket["__connected"]) break;
                let column1 = worldmapLeftTop[0] + Math.floor(i / worldmapSize) * 100;
                let row1 = worldmapLeftTop[1] + i % worldmapSize * 100;
                let column2 = Math.min(column1 + 99, worldmapRightBottom[0]);
                let row2 = Math.min(row1 + 99, worldmapRightBottom[1]);
                getWorldmapCommand.execute(socket, kingdomId, column1, row1, column2, row2);
                if (i % 5 === 4 || i === worldmapSize * worldmapSize - 1) {
                    for (let j = lastJ; j <= i; j++) {
                        try {
                            await WaitUntil(socket, `__worldmap_${kingdomId}_sector_${j}_found`, `__get_worldmap_${kingdomId}_sector_${j}_error`, 1000);
                            let data = socket[`__worldmap_${kingdomId}_sector_${j}_data`];
                            let worldmapAreas = data.worldmapAreas;
                            _worldmap._addAreaMapObjects(worldmapAreas);
                            let players = data.players;
                            _worldmap._addPlayers(players);
                            socket[`__worldmap_${kingdomId}_sector_${j}_found`] = false;
                            socket[`__get_worldmap_${kingdomId}_sector_${j}_error`] = "";
                            lastJ = j + 1;
                        } catch (e) {
                            if (e.message === "Exceeded max time" && (j > 100 || j < 25)) {
                                i = j + 1;
                                lastJ = j + 1;
                                socket[`__worldmap_${kingdomId}_sectors_found`] = j + 1;
                            } else {
                                i = j + 1;
                                lastJ = j + 1;
                                socket[`__worldmap_${kingdomId}_sectors_found`] = j + 1;
                            }
                            break;
                        }

                    }
                }
            }
            thisManager._worldmapCaches[kingdomId].date = new Date(Date.now() + cacheSec * 1000);
            thisManager._worldmapCaches[kingdomId].worldmap = _worldmap;
            socket[`__worldmap_${kingdomId}_found`] = true;
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
 * @param {number} x 0-9
 * @param {number} y 0-9
 * @returns {Promise<WorldmapSector>}
 */
function _getWorldmapSector(thisManager, socket, kingdomId, x, y) {
    return new Promise(async (resolve, reject) => {
            try {
                socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_searching`] = true;
                socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_found`] = false;
                socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_error`] = "";
                x = Math.max(0, Math.min(Math.floor(x), 9));
                y = Math.max(0, Math.min(Math.floor(y), 9));
                let column1 = worldmapLeftTop[0] + x * 100;
                let row1 = worldmapLeftTop[1] + y * 100;
                let column2 = Math.min(column1 + 99, worldmapRightBottom[0]);
                let row2 = Math.min(row1 + 99, worldmapRightBottom[1]);
                if(!socket["__connected"]) reject('Client disconnected');
                getWorldmapCommand.execute(socket, kingdomId, column1, row1, column2, row2);
                await WaitUntil(socket, `__worldmap_${kingdomId}_specific_sector_${x}_${y}_found`, `__worldmap_${kingdomId}_specific_sector_${x}_${y}_error`, 1000);
                let data = socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_data`];
                if(!data){
                    let sector = await _getWorldmapSector(thisManager, socket, kingdomId, x, y);
                    resolve(sector);
                }
                let worldmapSector = new WorldmapSector(socket.client, kingdomId, data);
                socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_found`] = false;
                socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_searching`] = false;
                socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_error`] = "";
                resolve(worldmapSector);
            } catch (e) {
                socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_searching`] = false;
                socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_found`] = false;
                socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_error`] = "";
                reject(e);
            }
        }
    )
        ;
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