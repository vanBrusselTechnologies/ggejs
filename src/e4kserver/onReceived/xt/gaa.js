const EmptyMapobject = require("./../../../structures/EmptyMapobject");
const CastleMapobject = require("./../../../structures/CastleMapobject");
const DungeonMapobject = require("./../../../structures/DungeonMapobject");
const CapitalMapobject = require("./../../../structures/CapitalMapobject");
const VillageMapobject = require("./../../../structures/VillageMapobject");
const BossDungeonMapobject = require("./../../../structures/BossDungeonMapobject");
const KingstowerMapobject = require("./../../../structures/KingstowerMapobject");
const MonumentMapobject = require("./../../../structures/MonumentMapobject");
const DynamicMapobject = require("./../../../structures/DynamicMapobject");
const AlienInvasionMapobject = require("./../../../structures/AlienInvasionMapobject");
const ResourceIsleMapobject = require("./../../../structures/ResourceIsleMapobject");
const DungeonIsleMapobject = require("./../../../structures/DungeonIsleMapobject");
const NomadKhanInvasionMapobject = require("./../../../structures/NomadKhanInvasionMapobject");
const NomadInvasionMapobject = require("./../../../structures/NomadInvasionMapobject");
const RedAlienInvasionMapobject = require("./../../../structures/RedAlienInvasionMapobject");
const ShapeshifterMapobject = require("./../../../structures/ShapeshifterMapobject");
const Player = require("./../../../structures/Player");

module.exports = {
    name: "gaa",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if (params === undefined) return;
        try {
            let _worldmapAreas = parseWorldmapAreas(socket.client, params.AI);
            let _players = parsePlayers(socket.client, params.OI);
            let sector = socket[`__worldmap_${params.KID}_sectors_found`];
            socket[`__worldmap_${params.KID}_sector_${sector}_data`] = { worldmapAreas: _worldmapAreas, players: _players };
            socket[`__worldmap_${params.KID}_sector_${sector}_found`] = true;
            socket[`__worldmap_${params.KID}_sectors_found`] += 1;
        }
        catch (e) {
            if(socket["debug"]) console.log(e);
            let sector = socket[`__worldmap_${params.KID}_sectors_found`];
            socket[`__get_worldmap_${params.KID}_sector_${sector}_error`] = e;
        }
    }
}

function parseWorldmapAreas(client, _data) {
    let worldmapAreas = [];
    for (let i in _data) {
        let data = _data[i];
        switch (data[0]) {
            case 0: worldmapAreas.push(new EmptyMapobject(client, data)); break;
            case 1: worldmapAreas.push(new CastleMapobject(client, data)); break;
            case 2: worldmapAreas.push(new DungeonMapobject(client, data)); break;
            case 3: worldmapAreas.push(new CapitalMapobject(client, data)); break;
            case 4: worldmapAreas.push(new CastleMapobject(client, data)); break;
            case 10: worldmapAreas.push(new VillageMapobject(client, data)); break;
            case 11: worldmapAreas.push(new BossDungeonMapobject(client, data)); break;
            case 12: worldmapAreas.push(new CastleMapobject(client, data)); break;
            case 21: worldmapAreas.push(new AlienInvasionMapobject(client, data)); break;
            case 22: worldmapAreas.push(new CapitalMapobject(client, data)); break;
            case 23: worldmapAreas.push(new KingstowerMapobject(client, data)); break;
            case 24: worldmapAreas.push(new ResourceIsleMapobject(client, data)); break;
            case 25: worldmapAreas.push(new DungeonIsleMapobject(client, data)); break;
            case 26: worldmapAreas.push(new MonumentMapobject(client, data)); break;
            case 27: worldmapAreas.push(new NomadInvasionMapobject(client, data)); break;
            case 31: worldmapAreas.push(new DynamicMapobject(client, data)); break;
            case 34: worldmapAreas.push(new RedAlienInvasionMapobject(client, data)); break;
            case 35: worldmapAreas.push(new NomadKhanInvasionMapobject(client, data)); break;
            case 36: worldmapAreas.push(new ShapeshifterMapobject(client, data)); break;
            default:
                console.log(`Current mapobject (areatype ${data[0]}) isn't fully supported!`);
                console.log(data);
                break;
        }
    }
    return worldmapAreas;
}

function parsePlayers(client, _data) {
    let players = [];
    for (let i in _data) {
        let data = { O: _data[i] };
        let _player = new Player(client, data);
        players.push(_player);
    }
    return players;
}