'use strict'

const BaseManager = require('./BaseManager');
const getWorldmapCommand = require('./../e4kserver/commands/getWorldmapCommand');
const { WaitUntil } = require('./../tools/wait');
const Worldmap = require('../structures/Worldmap');

const worldmapSize = 15;
const worldmapLeftTop = [0, 0];
const worldmapRightBottom = [worldmapSize * 100, worldmapSize * 100];
const cacheSec = 10;

class WorldmapManager extends BaseManager {
    _worldmapCaches = {
        0: { date: new Date(0), worldmap: new Worldmap() },
        2: { date: new Date(0), worldmap: new Worldmap() },
        1: { date: new Date(0), worldmap: new Worldmap() },
        3: { date: new Date(0), worldmap: new Worldmap() },
        4: { date: new Date(0), worldmap: new Worldmap() },
        10: { date: new Date(0), worldmap: new Worldmap() }
    };
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

function _getWorldmapById(thisManager, socket, _worldmap, kingdomId) {
    if (!_worldmap) return;
    if (_worldmap.kingdomId === null)
        _worldmap = new Worldmap(thisManager._client, kingdomId);
    _worldmap._clear();
    thisManager._worldmapCaches[kingdomId].date = new Date(Date.now() + cacheSec * 1000);
    return new Promise(async (resolve, reject) => {
        try {
            socket[`__worldmap_${kingdomId}_sectors_found`] = 0;
            socket[`__worldmap_${kingdomId}_found`] = false;
            socket[`__get_worldmap_${kingdomId}_error`] = "";
            for (let i = 0; i < worldmapSize * worldmapSize; i++) {
                let column1 = worldmapLeftTop[0] + Math.floor(i / worldmapSize) * 101;
                let row1 = worldmapLeftTop[1] + i % worldmapSize * 101;
                let column2 = Math.min(column1 + 100, worldmapRightBottom[0]);
                let row2 = Math.min(row1 + 100, worldmapRightBottom[1]);
                getWorldmapCommand.execute(socket, kingdomId, column1, row1, column2, row2);
                if (i % worldmapSize === worldmapSize - 1 || i === worldmapSize * worldmapSize - 1) {
                    for (let j = i - i % worldmapSize; j <= i; j++) {
                        await WaitUntil(socket, `__worldmap_${kingdomId}_sector_${j}_found`, `__get_worldmap_${kingdomId}_sector_${j}_error`);
                        let worldmapAreas = socket[`__worldmap_${kingdomId}_sector_${j}_data`];
                        _worldmap._addAreaMapObjects(worldmapAreas);
                        socket[`__worldmap_${kingdomId}_sector_${j}_found`] = false;
                        socket[`__get_worldmap_${kingdomId}_sector_${j}_error`] = "";
                    }
                }
            }
            thisManager._worldmapCaches[kingdomId].date = new Date(Date.now() + cacheSec * 1000);
            thisManager._worldmapCaches[kingdomId].worldmap = _worldmap;
            resolve(_worldmap);
        }
        catch (e) {
            reject(e);
        }
    });
}

function isWorldmapCached(thisManager, kingdomId) {
    return thisManager._worldmapCaches[kingdomId].date.getTime() >= Date.now();
}

module.exports = WorldmapManager