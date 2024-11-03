const {tmaps, tmapnodes} = require('e4k-data').data;

const EmptyMapobject = require("../structures/mapobjects/EmptyMapobject");
const CastleMapobject = require("../structures/mapobjects/CastleMapobject");
const DungeonMapobject = require("../structures/mapobjects/DungeonMapobject");
const CapitalMapobject = require("../structures/mapobjects/CapitalMapobject");
const VillageMapobject = require("../structures/mapobjects/VillageMapobject");
const BossDungeonMapobject = require("../structures/mapobjects/BossDungeonMapobject");
const EventDungeonMapobject = require("../structures/mapobjects/EventDungeonMapobject");
const AlienInvasionMapobject = require("../structures/mapobjects/AlienInvasionMapobject");
const KingstowerMapobject = require("../structures/mapobjects/KingstowerMapobject");
const ResourceIsleMapobject = require("../structures/mapobjects/ResourceIsleMapobject");
const DungeonIsleMapobject = require("../structures/mapobjects/DungeonIsleMapobject");
const MonumentMapobject = require("../structures/mapobjects/MonumentMapobject");
const NomadInvasionMapobject = require("../structures/mapobjects/NomadInvasionMapobject");
const DynamicMapobject = require("../structures/mapobjects/DynamicMapobject");
const RedAlienInvasionMapobject = require("../structures/mapobjects/RedAlienInvasionMapobject");
const NomadKhanInvasionMapobject = require("../structures/mapobjects/NomadKhanInvasionMapobject");
const ShapeshifterMapobject = require("../structures/mapobjects/ShapeshifterMapobject");
const BasicMapobject = require("../structures/mapobjects/BasicMapobject");
const SamuraiInvasionMapobject = require("../structures/mapobjects/SamuraiInvasionMapobject");
const DaimyoCastleMapobject = require("../structures/mapobjects/DaimyoCastleMapobject");
const DaimyoTownshipMapobject = require("../structures/mapobjects/DaimyoTownshipMapobject");
const ShadowAreaMapobject = require("../structures/mapobjects/ShadowAreaMapobject");
const FactionCampMapobject = require("../structures/mapobjects/FactionCampMapobject");
const FactionTowerMapobject = require("../structures/mapobjects/FactionTowerMapobject");
const FactionVillageMapobject = require("../structures/mapobjects/FactionVillageMapobject");
const FactionCapitalMapobject = require("../structures/mapobjects/FactionCapitalMapobject");
const WolfKingMapobject = require("../structures/mapobjects/WolfKingMapobject");
const TreasureMapMapobject = require("../structures/mapobjects/TreasureMapMapobject");
const InteractiveMapobject = require("../structures/mapobjects/InteractiveMapobject");
const SeaqueenMapCastleObject = require("../structures/mapobjects/SeaqueenMapCastleObject");
const SeaqueenMapBigCastleObject = require("../structures/mapobjects/SeaqueenMapBigCastleObject");
const SeaqueenMapCampObject = require("../structures/mapobjects/SeaqueenMapCampObject");
const SeaqueenMapShipObject = require("../structures/mapobjects/SeaqueenMapShipObject");
const SeaqueenMapKrakenObject = require("../structures/mapobjects/SeaqueenMapKrakenObject");

/**
 *
 * @param {Client} client
 * @param {[]} data
 * @returns {Mapobject}
 */
function parseMapobject(client, data) {
    if (data == null || !Array.isArray(data)) return null;
    if (data.length === 0) return new BasicMapobject(client, []);
    const areaType = data[0];
    if (data.length === 1) data = [];
    switch (areaType) {
        case 0:
            return new EmptyMapobject(client, data);
        case 1:
            return new CastleMapobject(client, data);
        case 2:
            return new DungeonMapobject(client, data);
        case 3:
            return new CapitalMapobject(client, data);
        case 4:
            return new CastleMapobject(client, data);
        case 7:
            return new TreasureMapMapobject(client, -1);
        case 8:
            return new SeaqueenMapCampObject(client, -1);
        case 9:
            return new ShadowAreaMapobject(client, data);
        case 10:
            return new VillageMapobject(client, data);
        case 11:
            return new BossDungeonMapobject(client, data);
        case 12:
            return new CastleMapobject(client, data);
        case 13:
            return new EventDungeonMapobject(client, data);
        //case 14:
        case 15:
            return new FactionCampMapobject(client, data);
        case 16:
            return new FactionVillageMapobject(client, data);
        case 17:
            return new FactionTowerMapobject(client, data);
        case 18:
            return new FactionCapitalMapobject(client, data);
        //case 19:
        //case 20:
        case 21:
            return new AlienInvasionMapobject(client, data);
        case 22:
            return new CapitalMapobject(client, data);
        case 23:
            return new KingstowerMapobject(client, data);
        case 24:
            return new ResourceIsleMapobject(client, data);
        case 25:
            return new DungeonIsleMapobject(client, data);
        case 26:
            return new MonumentMapobject(client, data);
        case 27:
            return new NomadInvasionMapobject(client, data);
        //case 28:
        case 29:
            return new SamuraiInvasionMapobject(client, data);
        case 31:
            return new DynamicMapobject(client, data);
        case 34:
            return new RedAlienInvasionMapobject(client, data);
        case 35:
            return new NomadKhanInvasionMapobject(client, data);
        case 36:
            return new ShapeshifterMapobject(client, data);
        case 37:
            return new DaimyoCastleMapobject(client, data);
        case 38:
            return new DaimyoTownshipMapobject(client, data);
        case 42:
            return new WolfKingMapobject(client, data);
        default:
            console.warn(`Current mapobject (areatype ${areaType}) isn't fully supported!`);
            console.log(data);
            return new BasicMapobject(client, data);
    }
}


/**
 *
 * @param {Client} client
 * @param {number} mapId
 * @param {number} type
 * @param {number} position
 * @returns {TreasureMapMapobject}
 */
function parseTreasureMapObject(client, mapId, type, position = -1) {
    /** @type {TreasureMapMapobject} */
    let treasureMapObject;
    switch (type) {
        case 3:
            treasureMapObject = new SeaqueenMapShipObject(client, type);
            break;
        case 10:
            treasureMapObject = new SeaqueenMapKrakenStandObject(client, type);
            break;
        case 7:
            treasureMapObject = new SeaqueenMapKrakenObject(client, type);
            break;
        case 2:
            const treasureMap = tmaps.find(map => map.mapID === mapId)
            const treasureMapNodeIds = treasureMap.tmapnodeIDs.split('+').map(id => parseInt(id))
            const treasureMapNode = tmapnodes.find(node => node.pos === position && treasureMapNodeIds.includes(node.tmapnodeID));
            if (treasureMapNode && treasureMapNode.type === "BRIDGEDUNGEON") {
                treasureMapObject = new SeaqueenMapBigCastleObject(client, type);
            } else {
                treasureMapObject = new SeaqueenMapCastleObject(client, type);
            }
            break;
        case 0:
            treasureMapObject = new SeaqueenMapCampObject(client, type);
            break;
        case 9:
            treasureMapObject = new SeaqueenMapCloudObject(client, type);
            break;
        case 4:
            treasureMapObject = new SeaqueenMapFogObject(client, type);
            break;
        case 1:
            treasureMapObject = new SeaqueenMapIslandObject(client, type);
            break;
        case 5:
            treasureMapObject = new SeaqueenMapLongIslandObject(client, type);
            break;
        case 6:
            treasureMapObject = new SeaqueenMapRockObject(client, type);
            break;
        default:
            treasureMapObject = new TreasureMapMapobject(client, type);
            break;
    }
    treasureMapObject.mapId = mapId;
    treasureMapObject.tMapPosition = position;
    return treasureMapObject;
}

module.exports.parseMapObject = parseMapobject;
module.exports.parseTreasureMapObject = parseTreasureMapObject;