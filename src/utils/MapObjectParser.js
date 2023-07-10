const EmptyMapobject = require("../structures/EmptyMapobject");
const CastleMapobject = require("../structures/CastleMapobject");
const DungeonMapobject = require("../structures/DungeonMapobject");
const CapitalMapobject = require("../structures/CapitalMapobject");
const VillageMapobject = require("../structures/VillageMapobject");
const BossDungeonMapobject = require("../structures/BossDungeonMapobject");
const EventDungeonMapobject = require("../structures/EventDungeonMapobject");
const AlienInvasionMapobject = require("../structures/AlienInvasionMapobject");
const KingstowerMapobject = require("../structures/KingstowerMapobject");
const ResourceIsleMapobject = require("../structures/ResourceIsleMapobject");
const DungeonIsleMapobject = require("../structures/DungeonIsleMapobject");
const MonumentMapobject = require("../structures/MonumentMapobject");
const NomadInvasionMapobject = require("../structures/NomadInvasionMapobject");
const DynamicMapobject = require("../structures/DynamicMapobject");
const RedAlienInvasionMapobject = require("../structures/RedAlienInvasionMapobject");
const NomadKhanInvasionMapobject = require("../structures/NomadKhanInvasionMapobject");
const ShapeshifterMapobject = require("../structures/ShapeshifterMapobject");
const BasicMapobject = require("../structures/BasicMapobject");

/**
 * 
 * @param {Client} client
 * @param {[]} data
 * @returns {Mapobject}
 */
function parseMapobject(client, data){
    if(data.length === 0) return new BasicMapobject(client, []);
    const areaType = data[0];
    if(data.length === 1) data = [];
    switch (areaType) {
        case 0: return new EmptyMapobject(client, data);
        case 1: return new CastleMapobject(client, data);
        case 2: return new DungeonMapobject(client, data);
        case 3: return new CapitalMapobject(client, data);
        case 4: return new CastleMapobject(client, data);
        case 10: return new VillageMapobject(client, data);
        case 11: return new BossDungeonMapobject(client, data);
        case 12: return new CastleMapobject(client, data);
        case 13: return new EventDungeonMapobject(client, data);
        case 21: return new AlienInvasionMapobject(client, data);
        case 22: return new CapitalMapobject(client, data);
        case 23: return new KingstowerMapobject(client, data);
        case 24: return new ResourceIsleMapobject(client, data);
        case 25: return new DungeonIsleMapobject(client, data);
        case 26: return new MonumentMapobject(client, data);
        case 27: return new NomadInvasionMapobject(client, data);
        case 31: return new DynamicMapobject(client, data);
        case 34: return new RedAlienInvasionMapobject(client, data);
        case 35: return new NomadKhanInvasionMapobject(client, data);
        case 36: return new ShapeshifterMapobject(client, data);
        default:
            console.log(`Current mapobject (areatype ${data[0]}) isn't fully supported!`);
            console.log(data);
            return new BasicMapobject(client, data);
    }
}

module.exports.parseMapObject = parseMapobject;