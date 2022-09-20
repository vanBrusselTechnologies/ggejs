'use strict'

const Socket = require('node:net').Socket;
const BaseManager = require('./BaseManager');
const Client = require('./../Client');
const getWorldmapCommand = require('./../e4kserver/commands/getWorldmapCommand');
const { WaitUntil } = require('./../tools/wait');
const Worldmap = require('../structures/Worldmap');

const worldmapSizes = [13, 10];
const worldmapLeftTop = [0, 0];
let worldmapRightBottom = [1000, 1000];
const cacheSec = 30;

class WorldmapManager extends BaseManager {
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
    _worldmapCaches = {
        0: { date: new Date(0), worldmap: new Worldmap() },
        2: { date: new Date(0), worldmap: new Worldmap() },
        1: { date: new Date(0), worldmap: new Worldmap() },
        3: { date: new Date(0), worldmap: new Worldmap() },
        4: { date: new Date(0), worldmap: new Worldmap() },
        10: { date: new Date(0), worldmap: new Worldmap() }
    };
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
            }
            catch (e) {
                reject(e);
            }
        })
    };
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
    if (!_worldmap) return;
    if (_worldmap.kingdomId === null)
        _worldmap = new Worldmap(thisManager._client, kingdomId);
    _worldmap._clear();
    return new Promise(async (resolve, reject) => {
        try {
            let worldmapSize = kingdomId === 0 ? worldmapSizes[0] : worldmapSizes[1];
            worldmapRightBottom = [worldmapSize * 100, worldmapSize * 100];
            socket[`__worldmap_${kingdomId}_sectors_found`] = 0;
            socket[`__get_worldmap_${kingdomId}_error`] = "";
            let lastJ = 0;
            for (let i = 0; i < worldmapSize * worldmapSize; i++) {
                let column1 = worldmapLeftTop[0] + Math.floor(i / worldmapSize) * 101;
                let row1 = worldmapLeftTop[1] + i % worldmapSize * 101;
                let column2 = Math.min(column1 + 100, worldmapRightBottom[0]);
                let row2 = Math.min(row1 + 100, worldmapRightBottom[1]);
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
                        }
                        catch (e) {
                            if (e.message === "Exceeded max time" && (j > 100 || j < 25)) {
                                i = j + 1;
                                lastJ = j + 1;
                                socket[`__worldmap_${kingdomId}_sectors_found`] = j + 1;
                            }
                            else{
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
        }
        catch (e) {
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