const {parseMapObject} = require("../../../utils/MapObjectParser")
const Player = require("./../../../structures/Player");

module.exports = {
    name: "gaa", /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {{KID:number, AI:[], OI:[]}} params
     */
    execute(socket, errorCode, params) {
        if (params === undefined) return;
        try {
            let _worldmapAreas = parseWorldmapAreas(socket.client, params.AI);
            if (_worldmapAreas.length === 0) return;
            let _players = parsePlayers(socket.client, params.OI);
            const position = _worldmapAreas[0].position;
            let x = Math.floor(position.X / 100);
            let y = Math.floor(position.Y / 100);
            if (socket[`__worldmap_${params.KID}_specific_sector_${x}_${y}_searching`]) {
                socket[`__worldmap_${params.KID}_specific_sector_${x}_${y}_data`] = {
                    worldmapAreas: _worldmapAreas, players: _players
                };
                socket[`__worldmap_${params.KID}_specific_sector_${x}_${y}_found`] = true;
                return;
            }
            let sector = socket[`__worldmap_${params.KID}_sectors_found`];
            socket[`__worldmap_${params.KID}_sector_${sector}_data`] = {
                worldmapAreas: _worldmapAreas, players: _players
            };
            socket[`__worldmap_${params.KID}_sector_${sector}_found`] = true;
            socket[`__worldmap_${params.KID}_sectors_found`] += 1;
        } catch (e) {
            if (socket.debug) console.log(e);
            let sector = socket[`__worldmap_${params.KID}_sectors_found`];
            socket[`__get_worldmap_${params.KID}_sector_${sector}_error`] = e;
        }
    }, parseWorldmapAreas(client, data) {
        if (!data) return [];
        return parseWorldmapAreas(client, data);
    }
}

/**
 * @param {Client} client
 * @param {[]} _data
 * @returns {Mapobject[]}
 */
function parseWorldmapAreas(client, _data) {
    let worldmapAreas = [];
    for (const data of _data) {
        worldmapAreas.push(parseMapObject(client, data))
    }
    return worldmapAreas;
}

function parsePlayers(client, _data) {
    let players = [];
    for (let i in _data) {
        let data = {O: _data[i]};
        let _player = new Player(client, data);
        players.push(_player);
    }
    return players;
}