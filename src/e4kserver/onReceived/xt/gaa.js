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

module.exports = {
    name: "gaa",
    /**
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if (params === undefined) return;
        try {
            let _worldmapAreas = parseWorldmapAreas(socket.client, params.AI);
            socket[`__worldmap_${params.KID}_sector_${socket[`__worldmap_${params.KID}_sectors_found`]}_found`] = true;
            socket[`__worldmap_${params.KID}_sector_${socket[`__worldmap_${params.KID}_sectors_found`]}_data`] = _worldmapAreas;
            socket[`__worldmap_${params.KID}_sectors_found`] += 1;
        }
        catch (e) {
            socket[`__get_worldmap_${params.KID}_sector_${socket[`__worldmap_${params.KID}_sectors_found`]}_error`] = e;
        }
    }
}

function parseWorldmapAreas(client, _data) {
    let worldmapAreas = [];
    for (i in _data) {
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
            case 35: worldmapAreas.push(new NomadKhanInvasionMapobject(client, data)); break;
            default:
                console.log(`Current mapobject (areatype ${data[0]}) isn't fully supported!`);
                console.log(data);
                break;
        }
    }
    return worldmapAreas;
}